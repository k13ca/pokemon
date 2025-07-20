import { useState, useEffect, useCallback } from "react";

export interface SimplePokemon {
  name: string;
  url: string;
}

interface UsePokemonsResult {
  pokemons: SimplePokemon[];
  loading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  nextPage: () => void;
  prevPage: () => void;
  search: (term: string) => void;
  resetSearch: () => void;
}

const PAGE_SIZE = 20;

export function usePokemons(): UsePokemonsResult {
  const [pokemons, setPokemons] = useState<SimplePokemon[]>([]);
  const [allPokemons, setAllPokemons] = useState<SimplePokemon[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const fetchPage = useCallback(async (pageNum: number) => {
    setLoading(true);
    setError(null);
    try {
      const offset = (pageNum - 1) * PAGE_SIZE;
      const res = await fetch(
        `https://pokeapi.co/api/v2/pokemon?limit=${PAGE_SIZE}&offset=${offset}`
      );
      if (!res.ok) throw new Error(res.statusText);
      const data = await res.json();
      setPokemons(data.results);
      setTotalPages(Math.ceil(data.count / PAGE_SIZE));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAll = useCallback(async () => {
    try {
      let all: SimplePokemon[] = [];
      let nextUrl:
        | string
        | null = `https://pokeapi.co/api/v2/pokemon?limit=100&offset=0`;
      while (nextUrl) {
        const res = await fetch(nextUrl);
        const data = await res.json();
        all = all.concat(data.results);
        nextUrl = data.next;
      }
      setAllPokemons(all);
    } catch {
      //
    }
  }, []);

  useEffect(() => {
    fetchPage(page);
    fetchAll();
  }, [page, fetchPage, fetchAll]);

  const nextPage = () => {
    if (page < totalPages) setPage((p) => p + 1);
  };
  const prevPage = () => {
    if (page > 1) setPage((p) => p - 1);
  };

  const search = (term: string) => {
    const filtered = allPokemons.filter((p) =>
      p.name.toLowerCase().includes(term.toLowerCase())
    );
    setPokemons(filtered);
    setTotalPages(1);
    setPage(1);
  };

  const resetSearch = () => {
    setPage(1);
    fetchPage(1);
  };

  return {
    pokemons,
    loading,
    error,
    page,
    totalPages,
    nextPage,
    prevPage,
    search,
    resetSearch,
  };
}
