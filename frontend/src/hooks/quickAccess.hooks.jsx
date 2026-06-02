import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../../utils/apiFetch.jsx";
import config from "../config.js";

export function useQuickAccess(){
    const { data, isLoading, isSuccess, isError, error } = useQuery({
        queryKey: ["quickAccess"],
        queryFn: async () => await apiFetch(`http://${config.SERVER}/api/quick-access`, "GET"),
        staleTime: 1000 * 60 * 20,
    })
    if(isError){
        throw new Error(error.message);
    }

    return {
        data,
        isLoading, 
        isSuccess,
        isError
    }
}
