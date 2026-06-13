import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { apiFetch } from '../../utils/apiFetch.jsx';
import config from "../config.js"

export function useAuth() {
    const queryClient = useQueryClient();
    const navigate = useNavigate(); 
	const [searchParams] = useSearchParams();
	const token = searchParams.get('token');
    
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
        onSuccess: () => navigate("/auth"),
        onError: (error) => console.error(error.message)
        
    })
  
	const resetPassword = useMutation({
		mutationFn: (password) => apiFetch(`http://${config.SERVER}/api/auth/reset-password`, 'PUT', { token, password }),
		onSuccess:() => navigate("/auth"),
		onError:(err) => { throw err; }
	})

	const sendResetPassword = useMutation({
		mutationFn: (email) => apiFetch(`http://${config.SERVER}/api/auth/forgot-password`, 'POST', email),
		onSuccess: () => {
			setTimeout(() => {
				navigate("/auth");
			}, 5000)
		}
	})

    return { loginMutation, signupMutation, logoutMutation, resetPassword, sendResetPassword, deleteMutation };
}
