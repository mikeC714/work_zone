import { useQuery, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserProvider } from './context/userContext.jsx'; 
import { AppRouter } from '../router/app.router.jsx'
import { Authentication } from './pages/auth.jsx';
import { apiFetch } from '../utils/apiFetch.jsx';

const queryClient = new QueryClient();

function Root() {
    const { data, isLoading } = useQuery({
        queryKey: ['session'],
        queryFn: () => apiFetch('http://localhost:3000/api/session', 'GET'),
        retry: false,
    });

    if (isLoading) return null;

    return data?.success
        ? <AppRouter />
        : <Authentication />;
}

export function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <UserProvider>
                <Root />
            </UserProvider>
        </QueryClientProvider>
    );
}