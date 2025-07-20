import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Console from './components/console';
import Loading from './components/loading';
import ErrorPage from './components/errorPage';


interface PokemonData {
    id: number;
    name: string;
    height: number;
    weight: number;
    sprites: { front_default: string };
    types: { type: { name: string } }[];
    abilities: { ability: { name: string } }[];
    stats: { base_stat: number; stat: { name: string } }[];
}

export default function ItemPage() {
    const { name } = useParams<{ name: string }>();
    const navigate = useNavigate();
    const [pokemon, setPokemon] = useState<PokemonData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);


    const [level, setLevel] = useState(0);
    const [cursor, setCursor] = useState(0);
    const [chosenStat, setChosenStat] = useState<string | null>(null);


    useEffect(() => {
        setLoading(true);
        fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
            .then(res => {
                if (!res.ok) throw new Error(res.statusText);
                return res.json();
            })
            .then((data: PokemonData) => setPokemon(data))
            .catch(e => setError((e as Error).message))
            .finally(() => setLoading(false));
    }, [name]);

    if (loading) return <Loading />;
    if (error) return <ErrorPage error={error} />;
    if (!pokemon) return <p>Not found</p>;


    const detail = {
        height: +(pokemon.height / 10).toFixed(1),
        weight: +(pokemon.weight / 10).toFixed(1),
        types: pokemon.types.map(t => t.type.name),
        skills: pokemon.abilities.map(a => a.ability.name),
        stats: pokemon.stats.reduce((acc, s) => {
            acc[s.stat.name] = s.base_stat;
            return acc;
        }, {} as Record<string, number>)
    };


    const nextId = pokemon.id + 1;
    const prevId = pokemon.id > 1 ? pokemon.id - 1 : null;
    const onNext = () => navigate(`/pokemon/${nextId}`);
    const onPrev = () => prevId && navigate(`/pokemon/${prevId}`);

    const mainMenu = ['options', 'prev', 'next'] as const;
    const optionsMenu = ['size', 'types', 'skills', 'stats'] as const;
    const statsMenu = ['hp', 'attack', 'defense', 'special-attack', 'special-defense', 'speed'] as const;

    const handleUp = () => {
        if (level === 0) return setCursor(0);
        if (level === 1) setCursor(i => Math.max(0, i - 1));
        if (level === 2) setCursor(i => Math.max(0, i - 1));
    };
    const handleDown = () => {
        if (level === 0) return setCursor(1);
        if (level === 1) setCursor(i => Math.min(optionsMenu.length - 1, i + 1));
        if (level === 2) setCursor(i => Math.min(statsMenu.length - 1, i + 1));
    };
    const handleLeft = () => {
        if (level === 0 && cursor > 1) setCursor(1);
    };
    const handleRight = () => {
        if (level === 0 && cursor > 0) setCursor(c => (c === 1 ? 2 : 1));
    };

    const handleEnter = () => {
        if (level === 0) {
            if (cursor === 0) {
                setLevel(1);
                setCursor(0);
            } else if (cursor === 1) onPrev();
            else onNext();
        }
        else if (level === 1) {
            if (cursor === 3) {
                setLevel(2);
                setCursor(0);
            } else {
                setChosenStat(null);
            }
        }
        else if (level === 2) {
            setChosenStat(statsMenu[cursor]);
        }
    };

    const handleBack = () => {
        if (level === 2) {
            setLevel(1);
            setCursor(3);
            setChosenStat(null);
        }
        else if (level === 1) {
            setLevel(0);
            setCursor(0);
            setChosenStat(null);
        }

    };

    let content: React.ReactNode = null;
    if (level === 0) {
        content = (
            content = <p>Height: {detail.height} m&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Weight: {detail.weight} kg</p>);
    } else if (level === 1) {
        const opt = optionsMenu[cursor];
        if (opt === 'size') {
            content = <p>Height: {detail.height} m<br />Weight: {detail.weight} kg</p>;
        } else if (opt === 'types') {
            content = <p>Types: {detail.types.join(' • ')}</p>;
        } else if (opt === 'skills') {
            content = <p>Skills: {detail.skills.join(', ')}</p>;
        } else {
            content = <p>Select a stat →</p>;
        }
    } else if (level === 2) {
        if (chosenStat) {
            content = <p>{chosenStat.replace('-', ' ')}: {detail.stats[chosenStat]}</p>;
        } else {
            content = <p>Select stat and press Enter</p>;
        }
    }

    let menuItems: string[] = [];
    if (level === 0) menuItems = mainMenu.map(m => m.toUpperCase());
    if (level === 1) menuItems = optionsMenu.map(o => o.toUpperCase());
    if (level === 2) menuItems = statsMenu.map(s => s.replace('-', ' ').toUpperCase());

    return (
        <div className='content-container pokedex'>
            <button style={{ marginBottom: 12 }} onClick={() => navigate('/')}>← back to pokemon list</button>
            <div className="pokedex-display">
                <div className="pokedex-content">
                    <h3>#{pokemon.id} {pokemon.name.toUpperCase()}</h3>
                    <img src={pokemon.sprites.front_default} className='pokedex-image' alt={pokemon.name} />
                    <div>{content}</div>

                    <div className="pokedex-options">
                        {menuItems.map((item, i) => (
                            <div
                                key={item}
                                className="pokedex-option"
                                style={{
                                    backgroundColor: i === cursor ? 'var(--blue)' : 'transparent',
                                }}
                            >
                                <h2>{item}</h2>
                            </div>
                        ))}
                    </div>
                </div>

                <Console
                    onUp={handleUp}
                    onDown={handleDown}
                    onLeft={handleLeft}
                    onRight={handleRight}
                    onEnter={handleEnter}
                    onBack={handleBack}
                />
            </div>
        </div>
    );
}
