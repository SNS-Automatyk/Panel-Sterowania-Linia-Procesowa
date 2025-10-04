export const API_URL = (() => {
    const env = import.meta.env;
    const fromEnv = env.VITE_API_URL || env.API_URL;
    if (fromEnv) return fromEnv;

    if (typeof window !== 'undefined' && window.location) {
        const { protocol, hostname } = window.location;
        const port = window.location.port ? `:${window.location.port}` : '';
        return `${hostname}:${port}`;
    }

    return 'localhost:8000';
})();