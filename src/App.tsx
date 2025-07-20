import './App.css'
import { usePokemons } from './hooks/usePokemons';
import { useState } from 'react';
import PokemonTile from './components/pokemonTile';
import arrow from './assets/arrow.png';
import Loading from './components/loading';
import ErrorPage from './components/errorPage';


function App() {

  const {
    pokemons,
    loading,
    error,
    page,
    totalPages,
    nextPage,
    prevPage,
    search,
    resetSearch,
  } = usePokemons();
  const [term, setTerm] = useState("");

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (term.trim()) search(term.trim());
  };

  return (
    <div className='content-container'>
      <img className="arrow" src={arrow} alt="arrow" />
      <h1 className='color-animation'>Choose Your Pokémon</h1>

      <form onSubmit={onSearch} className='flex-row search-bar'>
        <h2>FIND POKéMON →</h2>
        <div style={{ gap: 10 }} className='flex-row'>
          <input
            type="text"
            placeholder="..."
            value={term}
            onChange={(e) => {
              const val = e.target.value;
              setTerm(val);
              if (val.trim() === "") {
                resetSearch();
              }
            }}
          />
          <button type="button" onClick={() => { setTerm(""); resetSearch(); }}>
            X
          </button>
          <button type="submit">SEARCH</button></div>

      </form>

      {loading && <Loading />}
      {error && <ErrorPage error={error} />}

      <ul className="pokemon-grid">
        {pokemons.map((p) => (
          <li key={p.name}>
            <PokemonTile pokemon={p} />
          </li>
        ))}
      </ul>


      <div className='flex-row pagination'>
        <button onClick={prevPage} disabled={page === 1}>
          ← Previous
        </button>

        <h2>Page {page} / {totalPages}</h2>

        <button onClick={nextPage} disabled={page === totalPages}>
          Next →
        </button>
      </div>
    </div>
  );
}


export default App
