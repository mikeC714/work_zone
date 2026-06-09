import { useMutation } from '@tanstack/react-query';
import { apiFetch } from '../../utils/apiFetch.jsx';
import config from '../config.js';

export function useEmailHook(){
    return useMutation({
        mutationFn: async (quote) => await apiFetch(`http://${config.SERVER}/api/quote/send`, "POST", quote),
        retry: false,
		onSuccess:(() => {
			setTimeout(() => {
				window.location.reload();
			}, 3000)
		}),
		onError: (() => {
			setTimeout(() => window.location.reload(), 5000);
		})
    });
}
