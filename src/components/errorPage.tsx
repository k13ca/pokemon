import { Link } from 'react-router-dom';

interface ErrorPageProps {
    error?: string;
}

export default function ErrorPage({ error }: ErrorPageProps) {
    return (
        <div style={{ padding: 20, textAlign: 'center' }}>
            <button><Link to="/">← Go to main page</Link></button>
            {error ? <h1>ERROR</h1> : <h1>404</h1>}
            {error ? <p>{error}</p> : <p>Not found</p>}

        </div>
    );
}
