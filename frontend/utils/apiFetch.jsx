import { useQuery } from '@tanstack/react-query';


export async function apiFetch(url, method = 'GET', body = null){  
const options = {
    method,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    ...(body && {body: JSON.stringify(body)})
  };
  
    const res = await fetch(url, options);

    if (!res.ok) {
        const errorData = await res.json();
        console.log(errorData)
        throw new Error(errorData.message || "Failed to Fetch");
    }

  return res.json()
};
