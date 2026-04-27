import { createContext, useContext, useMemo } from 'react';

const UserContext = createContext();


export function UserProvider({children}){
    let firstName;
    let lastName; 
    let isLoading = null;
    

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
