import { createContext, useContext, useMemo } from 'react';
import { apiFetch } from '../../utils/apiFetch';
import { useQuery } from "@tanstack/react-query";
import { User } from "lucide-react";
import config from '../config.js';

const UserContext = createContext();


export function UserProvider({children}){
    
    const { data, isLoading } = useQuery({
        queryKey: ["user"],
        queryFn: async() => {
            return await apiFetch(`http://${config.SERVER}/api/auth/me`, "GET")
        },
    	retry: false,
    });

    const firstName = data?.user?.first_name ?? "";
    const lastName = data?.user?.last_name ?? "";
    const email = data?.user?.email;
    const created_at = data?.user?.created_at;
    const userId = data?.user?.id;
	const nameInitials = firstName && lastName ? `${firstName[0]}${lastName[0]}` : <User />;
    

    const value = useMemo(() => ({
        email,
        firstName,
        lastName,
        userId,
        created_at,
        nameInitials, 
        isLoading 
    }), [email, firstName, lastName, created_at, nameInitials, userId, isLoading])

    
    return(
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    )
}

export function useUserContext(){
    return useContext(UserContext)
}
