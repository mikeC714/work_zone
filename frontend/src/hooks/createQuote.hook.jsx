import { useQuery } from "@tanstack/react-query";
import config from "../config.js";

function useCreateQuote(){
    const { mutate, isPending, isError, error, isSuccess } = useMutation({
      mutationFn: async (data) => await apiFetch(`http://${config.SERVER}/api/create-quote`, 'POST', data),
    });

    return{
        mutate,
        isPending, 
        isError,
        error,
        isSuccess
    }
}

export default useCreateQuote;