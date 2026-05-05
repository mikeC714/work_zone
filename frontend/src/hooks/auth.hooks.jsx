import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../../utils/apiFetch.jsx';
import config from "../config.js"

export function useAuth() {
    const queryClient = useQueryClient();
    const navigate = new useNavigate(); 

    const loginMutation = useMutation({
        mutationFn: (credentials) => apiFetch(`http://${config.SERVER}/api/auth/login`, 'POST', credentials),
        onSuccess: ({ user }) => {
            queryClient.setQueryData(["user"], user);
            navigate("/dashboard")
        },
        onError: (err) => {
            throw new Error("Login Failed.", err.message);
        }
    });

    const signupMutation = useMutation({
        mutationFn: (credentials) => apiFetch(`http://${config.SERVER}/api/auth/signup`, 'POST', credentials),
        onSuccess: ({ user }) => {
            queryClient.setQueryData(["user"], user);
            navigate("/dashboard")
        },
        onError: (err) => {
            throw new Error("Failed to signup.", err.message);
        }
    });

    const logoutMutation = useMutation({
        mutationFn: (credentials) => apiFetch(`http://${config.SERVER}/api/auth/logout`, 'POST', credentials),
        onSuccess: () => {
            navigate("/auth");
        },
        onError: (err) => {
            throw new Error("Logout failed", err.message);
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (credentials) => apiFetch(`http://${config.SERVER}/api/auth/delete`, `DELETE`, credentials),
        onSuccess: () => console.log(`Successfully Deleted`),
        onError: (error) => console.error(error.message)

    })

    return { loginMutation, signupMutation, logoutMutation, deleteMutation };
}
