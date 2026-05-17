import { QueryClient, useMutation } from '@tanstack/react-query';
import { apiFetch } from '../../utils/apiFetch.jsx';
import { Loader } from 'lucide-react'; 
import config from '../config.js';

export async function useEmailHook(){
    const {mutate: sendEmail, isPending: isSendingEmail, isError: isEmailErr} = useMutation({
        mutationFn: async (quote) => await apiFetch(`http://${config.SERVER}/api/quote/send`, "POST", quote),
        retry: true,
        onSuccess: () => {
            QueryClient.invalidateQueries("customers")
        },
        isPending: () => {
            return (
                <div className="sendQuoteOverlay">
                    <p className="sendQuoteLoad"><Loader /></p>
                </div>
            )
        },
        onError: (error) => {
            return(
                <div className='sendQuoteOverlay'>
                    <p className="sendQuoteFail">Failed to send quote.</p>
                </div>
            )
        }   
    })

    return{
        sendEmail,
        isSendingEmail,
        isEmailErr
    }
}
