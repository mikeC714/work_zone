import { apiFetch } from "../../utils/apiFetch.jsx";

export function useCustomerTableHook(){
    const { data: customers, isLoading, isError, error } = useQuery(
        ['customers'],
        async () => (await fetch('http://localhost:3000/api/all-customers')).then(res => res.json()),
    )

    return{
        customers,
        isLoading, 
        isError,
        error
    }
}