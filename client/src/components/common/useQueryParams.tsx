import { useLocation } from 'react-router-dom';

export function useQueryParams() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

    const params: Record<string, string> = {};
    for (const [key, value] of searchParams.entries()) {
        params[key] = value;
    }

    return params;
}