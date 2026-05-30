import { createContext, useContext, useMemo } from 'react';
import { apiFetch } from '../../utils/apiFetch';
import { useQuery } from "@tanstack/react-query";
import config from '../config.js';

const UserContext = createContext();


export function UserProvider({children}){
    
    const { data, isLoading } = useQuery({
        queryKey: ["user"],
        queryFn: async() => {
            return await apiFetch(`http://${config.SERVER}/api/auth/me`, "GET")
        },
		staleTime: 0, 
    		retry: true,             
    		refetchOnMount: true,
    		refetchOnWindowFocus: true
    });

    const firstName = data?.data?.first_name ?? "";
    const lastName = data?.data?.last_name ?? "";
    const email = data?.data?.email;
    const created_at = data?.data?.created_at;
    const userId = data?.data?.id;

    const nameInitials = useMemo(() => {
		if(!firstName || !lastName) return "";
        return `${firstName[0]}${lastName[0]}` 
    }, [firstName, lastName]) 
    

    const value = useMemo(() => ({
        email,
        firstName,
        lastName,
        userId,
        created_at,
        nameInitials, 
        isLoading 
    }), [firstName, lastName, userId, email, created_at, nameInitials, isLoading])

    
    return(
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    )
}

export function useUserContext(){
    return useContext(UserContext)
}
