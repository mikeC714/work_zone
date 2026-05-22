import { useMemo } from "react";
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { apiFetch } from "../../utils/apiFetch.jsx";
import config from "../config.js"

export function useCustomerTableHook({activeFilter= '', searchFilter = '', page = 1, limit = 15}){
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['customers', activeFilter, page, limit], 
        queryFn: async() => await apiFetch(`http://${config.SERVER}/api/all-customers?activeFilter=${activeFilter}&page=${page}&limit=${limit}`),
        staleTime: 1000 * 60 * 5,
        placeholderData: keepPreviousData,
        retry: false
    })

    console.log(data?.paginated)


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
                    cus.quote.some(qt => qt.job?.some(job => job.description?.toLowerCase().includes(search)))
            )
        }
    );
}

        return result;

    }, [data, activeFilter, searchFilter]);


    return {
        paginated: data?.paginated, 
        filteredData: filteredData || {},
        isLoading, 
        isError, 
        error 
    }
}




