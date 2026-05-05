import { createContext, useContext, useMemo, useEffect, useState } from 'react';
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
        staleTime: Infinity
    });

    const firstName = data?.data?.first_name ?? "";
    const lastName = data?.data?.last_name ?? "";

    const nameInitials = useMemo(() => {
        if(!firstName || !lastName) return '';
        return `${firstName[0]}${lastName[0]}`;
    }, [firstName, lastName]);


    const value = useMemo(() => ({ 
        firstName,
        lastName, 
        nameInitials, 
        isLoading 
    }), [firstName, lastName, nameInitials, isLoading])

    
    return(
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    )
}

export function useUserContext(){
    return useContext(UserContext)
}
