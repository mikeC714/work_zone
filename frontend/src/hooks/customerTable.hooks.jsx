import { useMemo, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from "../../utils/apiFetch.jsx";
import { Loader } from "lucide-react";
import config from "../config.js"

export function useCustomerTableHook({activeFilter= '', searchFilter = '', page = 1, limit = 10}){
	const queryClient = useQueryClient();
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['customers', activeFilter, page, limit], 
        queryFn: async() => await apiFetch(`http://${config.SERVER}/api/all-customers?filter=${activeFilter}&page=${page}&limit=${limit}`),
        staleTime: 1000 * 60 * 10,
    })

	useEffect(() => {
		queryClient.prefetchQuery({
			queryKey: ['customers', activeFilter, page, limit],
			queryFn: async() => await apiFetch(`http://${config.SERVER}/api/all-customers?filter=${activeFilter}&page=${page+1}&limit=${limit}`),
			staleTime: 1000 * 60 * 10,
		})
	}, [queryClient, activeFilter, page, limit])


    const filteredData = useMemo(() => {
        let result = data?.cusData ?? [];

       if (searchFilter.trim() !== '') {
            const search = searchFilter.toLowerCase().trim();
            result = result.filter((cus, i) =>{
                const cusId = `qt-${String(i + 1).padStart(3, '0')}`;
                return(
                    cus.first_name?.toLowerCase().includes(search) ||
                    cus.last_name?.toLowerCase().includes(search) ||
                    `qt-${String(i + 1).padStart(3, '0')}`.includes(search.toLowerCase())||
                    cus.quote.some(qt => qt.job?.some(job => job.description?.toLowerCase().includes(search)),
					cusId
				)
            )
        }
    );
}       return result;
}, [data, searchFilter]);
		
	if(isLoading) return <Loader />


    return {
		paginated: data?.paginated, 
        filteredData: filteredData || {},
        isLoading, 
        isError, 
        error 
    }
}

export function useCustomerDelete(){
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (quoteID) => apiFetch(`http://${config.SERVER}/api/delete-quote`, 'DELETE', quoteID),
        onSuccess:() => {
            queryClient.invalidateQueries({ queryKey: ['customers'] })
            queryClient.invalidateQueries({ queryKey: ['quickAccess'] })
        },
        onError: (err) => console.log(err.message)
	})
}

