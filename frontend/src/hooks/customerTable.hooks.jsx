import { apiFetch } from "../../utils/apiFetch.jsx";
import { useQuery } from '@tanstack/react-query';

export function useCustomerTableHook(){
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['customers'],
        queryFn: async() => await apiFetch('http://localhost:3000/api/all-customers'),
        staleTime: 1000 * 60 * 5,
        retry: false
    })
    
    return { data, isLoading, isError, error }
}
