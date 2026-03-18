import { CustomerService } from '../service/customer.service.js';


const fakeUser = { id: crypto.randomUUID() }
const fakeCustomer = { name: 'John Doe', phone: '555-1234', email: 'john@email.com', address: '123 Main St' }
const fakeQuote = { status: 'pending', markup: 10, total: 500 }
const fakeWork = [
    [{ description: 'Install wiring', hours: 3, hourlyRate: 75, total: 225 }],
    [{ description: 'Copper wire', quantity: 10, metric: 'ft', unitCost: 2.50 }]
] 


const fakeSupabase = {
    from: () => ({
        insert: (data) => ({
            single: (customer) => ({
                data: { id: crypto.randomUUID(), ...data },
                error: null
            }),
            select: () => ({
                single: (quote) => ({
                    data: { id: crypto.randomUUID(), ...data },
                    error: null
                })
            }),
             then: (resolve) => Promise.resolve({ data, error: null }).then(resolve)
        })
    })
}
const customerService = new CustomerService(fakeSupabase)

const result = await customerService.createQuote(
    fakeUser,
    fakeCustomer,
    fakeQuote,
    ...fakeWork,
    new Date()
)

console.log(result)




// {
//   customerData: {
//     id: '7766d378-eaa8-4d6a-bb04-9abc5b49d97a',
//     user_id: 'd9614837-3929-4cc6-ac29-da575a49e303',
//     name: 'John Doe',
//     phone: '555-1234',
//     email: 'john@email.com',
//     address: '123 Main St',
//     created_at: 2026-03-18T02:21:41.079Z
//   },
//   quoteData: {
//     id: '0f2f636b-d668-4806-9f19-aef33383f5e7',
//     user_id: 'd9614837-3929-4cc6-ac29-da575a49e303',
//     customer_id: '7766d378-eaa8-4d6a-bb04-9abc5b49d97a',
//     token: 'd480bc61-3b6c-42c0-92fc-5112e6f43598',
//     status: 'pending',
//     markup: 10,
//     total: 500,
//     created_at: 2026-03-18T02:21:41.079Z
//   },
//   laborData: [
//     {
//       id: 'cf46b419-dda2-40c5-ad77-85f1005ef5ee',
//       user_id: 'd9614837-3929-4cc6-ac29-da575a49e303',
//       quote_id: '0f2f636b-d668-4806-9f19-aef33383f5e7',
//       description: 'Install wiring',
//       hours: 3,
//       hourly_rate: 75,
//       total: 225,
//       created_at: 2026-03-18T02:21:41.079Z
//     }
//   ],
//   materialsData: [
//     {
//       id: 'bd69842b-993f-41af-b0e7-0a1be2315661',
//       user_id: 'd9614837-3929-4cc6-ac29-da575a49e303',
//       quote_id: '0f2f636b-d668-4806-9f19-aef33383f5e7',
//       description: 'Copper wire',
//       quantity: 10,
//       unit_metric: 'ft',
//       unit_cost: 2.5,
//       created_at: 2026-03-18T02:21:41.079Z
//     }
//   ]
// }