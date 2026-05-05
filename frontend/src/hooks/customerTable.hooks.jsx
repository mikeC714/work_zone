import { useMemo } from "react";
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { apiFetch } from "../../utils/apiFetch.jsx";
import config from "../config.js"

export function useCustomerTableHook({activeFilter= 'ALL', searchFilter = '', page = 1, limit = 20}){
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['customers', page, limit],
        queryFn: async() => await apiFetch(`http://${config.SERVER}/api/all-customers?filter=page=${page}&limit=${limit}`),
        staleTime: 1000 * 60 * 5,
        placeholderData: keepPreviousData,
        retry: false
    })
    
    const filteredData = useMemo(() => {
        let result = data?.paginated?.totalCustomers ?? {};

        if (activeFilter !== 'ALL') {
            result = result.map(cus => ({
                    ...cus,
                    quote: cus.quote.filter(qt => 
                        qt.status === activeFilter.toLowerCase().replace(' ', '_')
                    )
                }))
                .filter(cus => cus.quote.length > 0);
        }

        if (searchFilter.trim() !== '') {
            const search = searchFilter.toLowerCase().trim();
            result = result.filter(cus => 
                cus.first_name?.toLowerCase().includes(search) ||
                cus.last_name?.toLowerCase().includes(search) ||
                cus.quote.some(qt => qt.job_id?.toLowerCase().includes(search))||
                cus.quote.some(qt => qt.job?.some(job => job.description.toLowerCase().includes(search)))
            );
        }

        return result;

    }, [data, activeFilter, searchFilter]);

    console.log(data, filteredData)

    return { 
        filterdData: filteredData || {},
        customers: data?.customers || [], 
        isLoading, 
        isError, 
        error 
    }
}




