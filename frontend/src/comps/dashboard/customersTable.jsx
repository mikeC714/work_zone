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
            <div className="customerTable">
                <div className="tableHead">
                    <div className="trLeft">
                        <p>JOB ID</p>
                        <p>CUSTOMER</p>
                    </div>
                    <div className="trRight">
                        <p>JOB TYPE</p>
                        <p>TOTAL</p>
                        <p>STATUS</p>
                        <p>UPDATED</p>
                    </div>
                </div>
                <div className="tableBody">
                    {data?.customers.map(customer =>
                        customer.quote.map(quote =>
                            quote.job.map(job => (
                            <div key={job.id} className="customerDataRow">
                                <div className="trLeft">
                                    <div className="cusomterJobId">{job.id}</div>
                                    <div className="customerNameTxt">{customer.name}
                                        <span className="customerAddressTxt">{customer.address}</span>
                                    </div>
                                </div>
                                <div className="trRight">
                                    <div className="quoteJobDescriptionTxt">{job.description}</div>
                                    <div className="quoteTotalTxt">{quote.total}</div>
                                    <div className={`quoteStatus ${statusClass[quote.status] ?? ''}`}>{quote.status}</div>
                                    <div className="quoteCreatedAtTxt">{quote.created_at}</div>
                                </div>
                            </div>
                         ))
                    ))}
                </div>
            </div>
            }
        </div>
    )
}
