import { apiFetch } from "../../utils/apiFetch.jsx";

 export const quickAccessQueries = [
            { queryKey:['monthlyRevenue'], queryFn: async() => { const data = await apiFetch('http://localhost:3000/api/monthly-revenue');  return data.monthTotal },  staleTime: 1000 * 60 * 5},
            { queryKey:['completedJobs'], queryFn: async() =>{ const data = await apiFetch('http://localhost:3000/api/completed-jobs'); return data.data.length },  staleTime: 1000 * 60 * 5},
            { queryKey:['activeJobs'], queryFn: async() => { const data = await apiFetch('http://localhost:3000/api/active-jobs'); return data.data.length },  staleTime: 1000 * 60 * 5},
            { queryKey:['unpaidJobs'], queryFn: async() => { const data = await apiFetch('http://localhost:3000/api/unpaid-jobs'); return data.data.length },  staleTime: 1000 * 60 * 5},
        ]
