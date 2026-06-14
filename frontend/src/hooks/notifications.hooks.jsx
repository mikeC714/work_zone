import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from "react";
import { apiFetch } from '../../utils/apiFetch.jsx';
import config from "../config.js";

export function useNotiHook({notiPage = 1, notiLimit, filter = "", clear = false}){
    const queryClient = useQueryClient();
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['notifications', notiPage, notiLimit, clear],
        queryFn: async() => await apiFetch(`${config.SERVER}/api/notifications?notiPage=${notiPage}&notiLimit=${notiLimit}&filter=${filter}&clear=${clear}`),
        staleTime: 1000 * 60 * 20,
        retry: false,
    })

    useEffect(() => {
        queryClient.prefetchQuery({
            queryKey: ['notifications', notiPage + 1, notiLimit, clear],
            queryFn: async() => await apiFetch(`${config.SERVER}/api/notifications?notiPage=${notiPage + 1}&notiLimit=${notiLimit}&clear=${clear}`),
            staleTime: 1000 * 60 * 20,
            retry: 1
        })
		if(clear === "true") queryClient.invalidateQueries({queryKey : ["notifications"]});
    }, [queryClient, notiPage, notiLimit, clear])

    return { 
		notifications: data?.notis ?? [],
        paginated: data?.paginated,
        isLoading, 
        isError, 
        error }
}
