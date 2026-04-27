import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '../../utils/apiFetch.jsx';
import config from "../config.js";

export function useNotiHook(){
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['notifications'],
        queryFn: async() => await apiFetch(`http://${config.SERVER}/api/notifications`),
        staleTime: 1000 * 60 * 5,
        refetchInterval: 1800000,
    })
    console.log(data)

    const notifications = data?.notifications ?? [];

    return { notifications, isLoading, isError, error }
}