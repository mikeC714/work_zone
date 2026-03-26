import { useMutation } from '@tanstack/react-query'
import { apiFetch } from '../../utils/apiFetch.jsx'

// export function useSendEmail(){
//     const { data,  isPending, isError, error } = useMutation({
//         mutationKey: ['customerEmail'],
//         mutationFn: async() => await apiFetch('http://localhost:3000/api/quote/send'),
//         retry: false 
//     })

//     return {
//         data, isPending, isError, error
//     }
// }


export async function sendQuote(payload){
     const res = await apiFetch('http://localhost:3000/api/quote/send', 'POST', payload)
     if(!res.ok){
        console.log('Failed to send quote')
     }
}

 const { mutate, isPending, isError, error } = useMutation({
        mutationFn: sendQuote,
        onSuccess: (data) => {
            console.log('Clear Form State')
        },
        onError: (error) => {
            console.error(error);
        }
    })
