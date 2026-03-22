import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '../../utils/apiFetch.jsx';

export function useNotiHook(){
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['notifications'],
        queryFn: async() => await apiFetch('http://localhost:3000/api/notifications'),
        staleTime: 1000 * 60 * 5,
        refetchInterval: 1800000,
    })
    console.log(data)
    return { data, isLoading, isError, error }
}