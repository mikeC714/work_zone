import { apiFetch } from "../../utils/apiFetch.jsx";
import { useQuery } from '@tanstack/react-query';


export function useCustomerTableHook(){
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['customers'],
        queryFn: async() => await apiFetch('http://localhost:3000/api/all-customers')
    })

    return { data, isLoading, isError, error }
}