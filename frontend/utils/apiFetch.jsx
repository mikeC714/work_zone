import { useQuery } from '@tanstack/react-query';


export const apiFetch = async(url, method = 'GET', body = null) => {
  
const options = {
    method,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' }
  };
  
  if(body){ 
        options.body = JSON.stringify(body)
    };

  const res = await fetch(url, options);

  if (!res.ok) throw new Error('Failed to Fetch');

  return res.json();
};

export function useApiFetch(queryKey, url, options= {}){
    return useQuery({
        queryKey,
        queryFn: apiFetch(url),
        staleTime:  1000 * 60 * 5,
        ...options
    })
} 
