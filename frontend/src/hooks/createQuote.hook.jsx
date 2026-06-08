import {  useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../../utils/apiFetch.jsx";
import config from "../config.js";

export function useCreateQuote({ setSuccess, setCqErr }){
  const queryClient = useQueryClient();
  
    return useMutation({
        mutationFn: async (data) => await apiFetch(`http://${config.SERVER}/api/create-quote`, 'POST', data),
            onError: () => {
            	setCqErr(true);
				setTimeout(() => {
					setCqErr(false);
				}, 10000)
            },
            onSuccess:() => {
				setSuccess(true);
				setTimeout(() => {
					setSuccess(false);
					window.location.reload();
				}, 20000);
              	queryClient.invalidateQueries({ queryKey:['quickAccess'] });
				queryClient.invalidateQueries({ queryKey:['customers'] });
			}
    });

}
