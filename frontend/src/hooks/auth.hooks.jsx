import { useMutation, useQueryClient, useQuery} from '@tanstack/react-query';
import { apiFetch } from '../../utils/apiFetch.jsx';

export function useAuth() {
    const queryClient = useQueryClient();
    const invalidateSession = () => queryClient.invalidateQueries({ queryKey: ['session'] });

    const loginMutation = useMutation({
        mutationFn: (credentials) => apiFetch('http://localhost:3000/api/login', 'POST', credentials),
        onSuccess: invalidateSession,
    });

    const signupMutation = useMutation({
        mutationFn: (credentials) => apiFetch('http://localhost:3000/api/signup', 'POST', credentials),
        onSuccess: invalidateSession,
    });

    const logoutMutation = useMutation({
        mutationFn: () => apiFetch('http://localhost:3000/api/logout', 'POST'),
        onSuccess: invalidateSession,
    });

    return { loginMutation, signupMutation, logoutMutation };
}

export function useSession(){
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['userSession'],
        queryFn: async() => apiFetch('http://localhost:3000/api/session'),
        staleTime: 1000 * 60 * 5,
        retry: false
    })
    if(isLoading){
        console.log('User session query is loading')
    }
    if(isError){
        console.error(`Failed to query user session: ${error.message}`)
    }

    const firstName = data?.user?.user_metadata?.first_name;
    const lastName = data?.user?.user_metadata?.last_name;

    return {
        name:{
            firstName,
            lastName
        },
        isLoading
    }
}