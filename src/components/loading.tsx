
import type { CSSProperties } from 'react';
import pokeball from '../assets/pokeball.png';

interface LoadingProps {
    size?: CSSProperties['width'];
}

export default function Loading({ size = "200px" }: LoadingProps) {
    return (
        <div className="loading-wrapper">
            <img className="pokeball" src={pokeball} alt="Loading…" style={{ width: size, height: size }} />
        </div>
    );
}