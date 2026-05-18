import { useMemo } from "react";
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { apiFetch } from "../../utils/apiFetch.jsx";
import config from "../config.js"

export function useCustomerTableHook({activeFilter= 'ALL', searchFilter = '', page = 1, limit = 20}){
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['customers', page, limit], 
        queryFn: async() => await apiFetch(`http://${config.SERVER}/api/all-customers?page=${page}&limit=${limit}`),
        staleTime: 1000 * 60 * 5,
        placeholderData: keepPreviousData,
        retry: false
    })

    const filteredData = useMemo(() => {
        let result = data?.cusData ?? [];

        if (activeFilter !== 'ALL') {
            result = result.map(cus => ({
                    ...cus,
                    quote: cus.quote.filter(qt => 
                        qt.status === activeFilter
                    )
                }))
                .filter(cus => cus.quote.length > 0) 
        }

       if (searchFilter.trim() !== '') {
            const search = searchFilter.toLowerCase().trim();
            result = result.filter((cus, i) =>{
                const cusId = `qt-${String(i + 1).padStart(3, '0')}`;
                return(
                    cus.first_name?.toLowerCase().includes(search) ||
                    cus.last_name?.toLowerCase().includes(search) ||
                    `qt-${String(i + 1).padStart(3, '0')}`.includes(search.toLowerCase())||
                    cus.quote.some(qt => qt.job?.some(job => job.description?.toLowerCase().includes(search)))
            )
        }
    );
}

        return result;

    }, [data, activeFilter, searchFilter]);


    return {
        data, 
        filteredData: filteredData || {},
        customers: data?.paginated?.paginatedCustomers || [], 
        isLoading, 
        isError, 
        error 
    }
}




