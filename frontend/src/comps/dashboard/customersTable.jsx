import { calendarConfig } from '../../../config/calender.config.js';
import calendar from 'dayjs/plugin/calendar';
import dayjs from 'dayjs';

export function CustomerTable({ filteredData }) {

    dayjs.extend(calendar);

    function QuoteStatus({status}){
        switch(status){
            case 'sent' :
                return <div className='quoteStatus sentStatusStyle'>SENT</div>
            case 'pending' :
                return <div className='quoteStatus pendingStatusStyle'>PENDING</div> 
            case 'approved' :
                return <div className='quoteStatus approvedStatusStyle'>APPROVED</div>
            case 'completed' :
                return <div className='quoteStatus completedStatusStyle'>COMPLETED</div>
            default:
                return <div className='quoteStatus draftStatusStyle'>DRAFT</div>
        
        }
    }

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
                    { filteredData?.length > 0 ? filteredData.map((customer, customerIndex )=>
                        customer.quote.map(quote=>
                            <div key={quote.id} className="customerDataRow">
                                <div className="trLeft">
                                    <div className="cusomterJobId">QT-{String(customerIndex + 1).padStart(3,0)}</div>
                                    <div className="customerNameNAdd">
                                        <span className="customerAddressTxt"> {customer.name}{customer.address}</span>
                                    </div>
                                </div>
                                <div className="trRight">
                                    <div className="quoteJobDescriptionTxt">{quote?.job[0]?.description}</div>
                                    <div className="quoteTotalTxt">${quote.total.toLocaleString()}</div>
                                    <div className="quoteStatusCell"><QuoteStatus status={quote.status} /></div>
                                    <div className="quoteCreatedAtTxt">{dayjs(quote.created_at).calendar(null, calendarConfig)}</div>
                                </div>
                            </div>
                    )) : <p> No Customers.</p> }
                </div>
            </div>
        </div>
    )
}
