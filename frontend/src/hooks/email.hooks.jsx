import { useMutation } from '@tanstack/react-query';
import { apiFetch } from '../../utils/apiFetch.jsx';
import { Loader } from 'lucide-react'; 
import config from '../config.js';

export function useEmailHook(){
    const {mutate, isPending: isSendingEmail, isError: isEmailErr} = useMutation({
        mutationFn: async (quote) => await apiFetch(`http://${config.SERVER}/api/quote/send`, "POST", quote),
        retry: true,
        
    })

    return{
        mutate,
        isSendingEmail,
        isEmailErr
    }
}
