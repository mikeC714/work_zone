import { useMutation, useQueryClient } from '@tanstack/react-query';
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