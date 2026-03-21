import { createContext, useContext, useMemo } from 'react';
import { useSession } from '../hooks/auth.hooks.jsx';

const UserContext = createContext();


export function UserProvider({children}){
    const { name:{ firstName, lastName }, isLoading } = useSession();

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
