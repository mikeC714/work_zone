import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { apiFetch } from '../../utils/apiFetch.jsx';
import config from "../config.js"

function useAuth() {
    const loginMutation = useMutation({
        mutationFn: (credentials) => apiFetch(`http://${config.SERVER}/api/auth/login`, 'POST', credentials)
    });

    const signupMutation = useMutation({
        mutationFn: (credentials) => apiFetch(`http://${config.SERVER}/api/auth/signup`, 'POST', credentials)
    });

    const logoutMutation = useMutation({
        mutationFn: (credentials) => apiFetch(`http://${config.SERVER}/api/auth/logout`, 'POST', credentials)
    });

    const deleteMutation = useMutation({
        mutationFn: (credentials) => apiFetch(`http://${config.SERVER}/api/auth/delete`, `DELETE`, credentials),
        onSuccess: () => console.log(`Successfully Deleted`),
        onError: (error) => console.error(error.message)

    })

    return { loginMutation, signupMutation, logoutMutation, deleteMutation };
}

export default useAuth;