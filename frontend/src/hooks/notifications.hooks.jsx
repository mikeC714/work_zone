import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '../../utils/apiFetch.jsx';
import config from "../config.js";

export function useNotiHook({notiPage = 1, notiLimit, clear = false}){
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['notifications', notiPage, notiLimit],
        queryFn: async() => await apiFetch(`http://${config.SERVER}/api/notifications?notiPage=${notiPage}&notiLimit=${notiLimit}&clear=${clear}`),
        staleTime: 1000 * 60 * 5,
        refetchInterval: 1800000,
    })

    const notifications = data?.nonRead ?? [];
    console.log(data);

    return { 
        notifications,
        paginated: data?.paginated,
        isLoading, 
        isError, 
        error }
}