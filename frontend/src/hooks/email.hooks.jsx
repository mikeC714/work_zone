import { useMutation } from '@tanstack/react-query';
import { apiFetch } from '../../utils/apiFetch.jsx';
import config from '../config.js';

export function useEmailHook({ setEmailErr, setSentEmail }){
    const {mutate, isPending: isSendingEmail } = useMutation({
        mutationFn: async (quote) => await apiFetch(`http://${config.SERVER}/api/quote/send`, "POST", quote),
        retry: false,
		onSuccess:(() => {
			setSentEmail(true);
			setTimeout(() => {
				setSentEmail(false);
				window.location.reload();
			}, 22000)
		}),
		onError: (() => {
			setEmailErr(true);
			setTimeout(() => setEmailErr(false), 10000);
		})
    });
    return{
        mutate,
        isSendingEmail
    }
}
