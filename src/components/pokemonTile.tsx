import { Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'

interface SimplePokemon {
    name: string
    url: string
}

interface CryUrls {
    latest?: string
    legacy?: string
}

interface PokemonDetail {
    sprites: {
        front_default: string | null
    }
    cries?: CryUrls
}

interface PokemonTileProps {
    pokemon: SimplePokemon
}

export default function PokemonTile({ pokemon }: PokemonTileProps) {
    const [sprite, setSprite] = useState<string | null>(null)
    const [cry, setCry] = useState<string | null>(null)
    const audioRef = useRef<HTMLAudioElement | null>(null)

    useEffect(() => {
        fetch(pokemon.url)
            .then(res => {
                if (!res.ok) throw new Error(res.statusText)
                return res.json() as Promise<PokemonDetail>
            })
            .then(data => {
                setSprite(data.sprites.front_default)
                if (data.cries?.latest) {
                    setCry(data.cries.latest)
                }
            })
            .catch(console.error)
    }, [pokemon.url])

    const playCry = () => {
        if (!cry) return
        if (audioRef.current) {
            audioRef.current.pause()
            audioRef.current.currentTime = 0
        }
        const audio = new Audio(cry)
        audioRef.current = audio
        audio.play().catch(console.error)
    }


    return (
        <Link to={`/pokemon/${pokemon.name}`} className="pokemon-tile" onMouseEnter={playCry}>
            {sprite ? (
                <img src={sprite} alt={pokemon.name} />
            ) : (
                <div className="sprite-placeholder" />
            )}
            <p>{pokemon.name}</p>
        </Link>
    )
}
