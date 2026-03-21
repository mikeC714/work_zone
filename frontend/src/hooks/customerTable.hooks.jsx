import { apiFetch } from "../../utils/apiFetch.jsx";
import { useQuery } from '@tanstack/react-query';

export const customerTableData = [
    {
        customer: {
            name: 'Mitch Smith',
            phone: '555-555-555',
            email: 'mitchSmitty@email.com',
            address: 'Fake Ave 123'
        },
        quote: [{
            job: [
                {
                    id:1,
                    description: 'Panel Install',
                    hours: 3,
                    hourly_rate: 20,
                }
            ],
            status: 'sent',
            total: 2000,
            markup: 20,
            created_at: Date.now(),
        }]
    },
    {
        customer: {
            name: 'Mitch Smith',
            phone: '555-555-555',
            email: 'mitchSmitty@email.com',
            address: 'Fake Ave 123'
        },
        quote: [{
            job: [
                {
                    id:2,
                    description: 'Panel Install',
                    hours: 3,
                    hourly_rate: 20,
                }
            ],
            status: 'completed',
            total: 2000,
            markup: 20,
            created_at: Date.now(),
        }]
    },
    {
        customer: {
            name: 'Mitch Smith',
            phone: '555-555-555',
            email: 'mitchSmitty@email.com',
            address: 'Fake Ave 123'
        },
        quote: [{
            job: [
                {
                    id:3,
                    description: 'Panel Install',
                    hours: 3,
                    hourly_rate: 20,
                }
            ],
            status: 'approved',
            total: 2000,
            markup: 20,
            created_at: Date.now(),
        }]
    }
]


export function useCustomerTableHook(){
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['customers'],
        queryFn: async() => await apiFetch('http://localhost:3000/api/all-customers'),
        staleTime: 1000 * 60 * 5,
        retry: false
    })

    console.log(data);
    return { isLoading, isError, error }
}
