import { useQuery } from '@tanstack/react-query';


export async function apiFetch(url, method = 'GET', body = null){  
const options = {
    method,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    ...(body && {body: JSON.stringify(body)}),
  };
  
    const res = await fetch(url, options);

    if (!res.ok) {
      let message;

      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const errorData = await res.json();
        message = errorData.message;
      } else {
        const text = await res.text();
        console.error('Non-JSON error response:', text); 
      }

    throw new Error(message);
  }

  return await res.json()
};
