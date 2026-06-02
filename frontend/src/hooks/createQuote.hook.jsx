import {  useMutation, useQueryClient} from "@tanstack/react-query";
import { apiFetch } from "../../utils/apiFetch.jsx";
import config from "../config.js";

export function useCreateQuote(){
  const queryClient = useQueryClient();
  
    return useMutation({
        mutationFn: async (data) => await apiFetch(`http://${config.SERVER}/api/create-quote`, 'POST', data),
            onError: (err) => {
              console.log(err.message)
            },
            onSuccess:() => {
              queryClient.invalidateQueries({
                queryKey:['quickAccess', 'customers']
              })
            } 
    });

}
