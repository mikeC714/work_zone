import { customerTableData, useCustomerTableHook} from '../../hooks/customerTable.hooks.jsx'



export function CustomerTable() {
    const {  isLoading, isError, error } = useCustomerTableHook();

    console.log(customerTableData);

    const statusClass = {
        'sent': 'status-sent',
        'approved': 'status-approved',
        'in progress': 'status-in-progress',
        'completed': 'status-completed',
        };

    return(
        <div>
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
                    { customerTableData?.length > 0 ? customerTableData.map((customer, customerIndex )=>
                        customer.quote.map(quote=>
                            quote.job.map(job=> (
                            <div key={job.id} className="customerDataRow">
                                <div className="trLeft">
                                    <div className="cusomterJobId">QT-{String(customerIndex + 1).padStart(3,0)}</div>
                                    <div className="customerNameTxt">{customer.customer.name}
                                        <span className="customerAddressTxt">{customer.customer.address}</span>
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
                    )) : <p> No Customers.</p> }
                </div>
            </div>
        </div>
    )
}
