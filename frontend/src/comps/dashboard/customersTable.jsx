import { useCustomerTableHook } from "../../hooks/customerTableHook.jsx"


export function CustomerTable() {
    const { customers, isLoading, isError, error } = useCustomerTableHook();
    const statusClass = {
        'sent': 'status-sent',
        'approved': 'status-approved',
        'in progress': 'status-in-progress',
        'completed': 'status-completed',
        };
    return(
        <div>
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
                    {customers.map(customer => (
                        <tr key={'tableData'}>
                            <td className="cusomterJobId" >{customer.quoteDetails.job_id}</td>
                            <td className="customerNameTxt" >{customer.customerDetails.name}
                                <span className="customerAddressTxt" >{customer.customerDetails.address}</span>
                            </td>
                            <td className="quoteJobDescriptionTxt" >{customer.jobDetails.description}</td>
                            <td className="quoteTotalTxt" >{customer.quoteDetails.total}</td>
                            <td className={`quoteStatus ${statusClass[customer.quoteDetails.status] ?? ''}`}>{customer.quoteDetails.status }</td>
                            <td className="quoteCreatedAtTxt" >{customer.quoteDetails.created_at}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}