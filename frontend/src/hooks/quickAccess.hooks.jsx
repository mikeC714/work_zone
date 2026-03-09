import { apiFetch } from "../../utils/apiFetch.jsx";

 export const quickAccessQueries = [
            { queryKey:['monthlyRevenue'], queryFn: async() => { const data = await apiFetch('http://localhost:3000/api/monthly-revenue'); return data.monthTotal }},
            { queryKey:['completedJobs'], queryFn: async() =>{ const data = await apiFetch('http://localhost:3000/api/completed-jobs'); return data.data.length }},
            { queryKey:['activeJobs'], queryFn: async() => { const data = await apiFetch('http://localhost:3000/api/active-jobs'); return data.data.length }},
            { queryKey:['unpaidJobs'], queryFn: async() => { const data = await apiFetch('http://localhost:3000/api/unpaid-jobs'); return data.data.length }},
        ]
