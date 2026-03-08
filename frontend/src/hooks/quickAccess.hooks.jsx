import { apiFetch } from '../../utils/apiFetch.js';

 export const quickAccessQueries = useQueries({
        queries: [
            { queryKey:['monthlyRevenue'], queryFn: async() => apiFetch('http://localhost:3000/api/monthly-revenue') },
            { queryKey:['completedJobs'], queryFn: async() => apiFetch('http://localhost:3000/api/completed-jobs') },
            { queryKey:['activeJobs'], queryFn: async() => apiFetch('http://localhost:3000/api/active-jobs') },
            { queryKey:['unpaidJobs'], queryFn: async() => apiFetch('http://localhost:3000/api/unpaid-jobs') },
        ]
    })
