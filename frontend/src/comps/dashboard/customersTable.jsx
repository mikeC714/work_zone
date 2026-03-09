import { useCustomerTableHook } from "../../hooks/customerTableHook.jsx"


export function CustomerTable() {
    const { data, isLoading, isError, error } = useCustomerTableHook();

    console.log(data);

    const statusClass = {
        'sent': 'status-sent',
        'approved': 'status-approved',
        'in progress': 'status-in-progress',
        'completed': 'status-completed',
        };
    return(
        <div>
            {isLoading ? <h2>Loading...</h2> :
            <table>
                <thead>
                    <tr>
                        <th>JOB ID</th>
                        <th>CUSTOMER</th>
                        <th>JOB TYPE</th>
                        <th>TOTAL</th>
                        <th>STATUS</th>
                        <th>UPDATED</th>
                    </tr>
                </thead>
                <tbody>
                    {data.customers.map(customer =>
                        customer.quote.map(quote => 
                            quote.job.map(job => (
                            <tr key={'tableData'}>
                                <td className="cusomterJobId" >{job.id}</td>
                                <td className="customerNameTxt" >{customer.name}
                                    <span className="customerAddressTxt" >{customer.address}</span>
                                </td>
                                <td className="quoteJobDescriptionTxt" >{job.description}</td>
                                <td className="quoteTotalTxt" >{quote.total}</td>
                                <td className={`quoteStatus ${statusClass[quote.status] ?? ''}`}>{quoteDetails.status }</td>
                                <td className="quoteCreatedAtTxt" >{quote.created_at}</td>
                            </tr>
                         ))
                    ))}
                </tbody>
            </table> 
            }
        </div>
    )
}