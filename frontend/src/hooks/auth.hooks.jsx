import { useMutation, useQueryClient, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '../../utils/apiFetch.jsx';
import config from "../config.js"

const queryClient = useQueryClient();

export function useAuth() {
    const loginMutation = useMutation({
        mutationFn: (credentials) => apiFetch(`http://${config.SERVER}/api/auth/login`, 'POST', credentials),
        onSuccess: ({ user }) => {
            queryClient.setQueryData(["user"], user);
        },
        onError: (err) => {
            throw new Error("Login Failed.", err.message);
        }
    });

    const signupMutation = useMutation({
        mutationFn: (credentials) => apiFetch(`http://${config.SERVER}/api/auth/signup`, 'POST', credentials),
        onSuccess: ({ user }) => {
            queryClient.setQueryData(["user"], user);
        },
        onError: (err) => {
            throw new Error("Failed to signup.", err.message);
        }
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
