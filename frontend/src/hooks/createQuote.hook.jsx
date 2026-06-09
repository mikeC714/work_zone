import {  useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../../utils/apiFetch.jsx";
import config from "../config.js";

export function useCreateQuote(){
  const queryClient = useQueryClient();
  
    return useMutation({
        mutationFn: async (data) => await apiFetch(`http://${config.SERVER}/api/create-quote`, 'POST', data),
            onError: () => {
				setTimeout(() => {
				}, 5000)
            },
            onSuccess:() => {
				setTimeout(() => {
					window.location.reload();
				}, 3000);
              	queryClient.invalidateQueries({ queryKey:['quickAccess'] });
				queryClient.invalidateQueries({ queryKey:['customers'] });
			}
    });

}
