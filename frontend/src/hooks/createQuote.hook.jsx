import { useQuery, useMutation } from "@tanstack/react-query";
import { apiFetch } from "../../utils/apiFetch.jsx";
import config from "../config.js";

export function useCreateQuote(){
    return useMutation({
        mutationFn: async (data) => await apiFetch(`http://${config.SERVER}/api/create-quote`, 'POST', data),
            onError: (err) => {
              console.log(err.message)
            },
            onSuccess:() => {
              console.log("Successfully created new quote.")
            } 
    });
}
