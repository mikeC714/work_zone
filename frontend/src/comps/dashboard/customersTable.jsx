import { calendarConfig } from '../../../config/calender.config.js';
import { ArrowLeft, ArrowRight, Trash2 } from "lucide-react";
import calendar from 'dayjs/plugin/calendar';
import dayjs from 'dayjs';

export function CustomerTable({ data, page, currPage, setPage, handleDelete }) {
    
    dayjs.extend(calendar);

    function QuoteStatus({ status }){
        switch(status){
            case 'SENT' :
                return <div className='quoteStatus sentStatusStyle'>SENT</div>
            case 'PENDING' :
                return <div className='quoteStatus pendingStatusStyle'>PENDING</div> 
            case 'APPROVED' :
                return <div className='quoteStatus approvedStatusStyle'>APPROVED</div>
            case 'COMPLETED' :
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
                    { data?.length > 0 ? 
                    data.map((customer, customerIndex ) =>
                        [...customer.quote]
                            .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
                            .map(quote =>
                                <div key={quote.id} className="customerDataRow">
                                    <div className="trLeft">
                                        <button 
                                            className='customerDeleteBtn'
                                            onClick={() => handleDelete({ quoteId: quote.id }) }
                                            >
                                                <Trash2 className='customerDeleteIcon' />
                                            </button>
                                        <div className="cusomterJobId">QT-{String(customerIndex + 1).padStart(3,0)}</div>
                                        <div className="customerNameNAdd">
                                            <span className="customerAddressTxt"> {customer.name}{customer.address}</span>
                                        </div>
                                    </div>
                                    <div className="trRight">
                                        <div className="quoteJobDescriptionTxt">{quote?.job[0]?.description}</div>
                                        <div className="quoteTotalTxt">${quote.total.toLocaleString()}</div>
                                        <div 
                                            className="quoteStatusCell"
                                        >
                                            <QuoteStatus status={quote?.status} />
                                        </div>
                                        <div className="quoteCreatedAtTxt">{dayjs(quote?.created_at).calendar(null, calendarConfig)}</div>
                                    </div>
                                </div>
                        )) :<p> No Customers.</p> }
                </div>
                <div className='pageBtnContainer'>
                    <button
                        disabled = {page?.prevPage ? false : true}
                        onClick={() => setPage(p => p -1)}
                    >
                        <ArrowLeft />
                    </button>
                    <button 
                        disabled = {page?.nextPage ? false : true }
                        onClick={() => setPage(p => p +1)}
                    >
                        <ArrowRight />
                    </button>
                </div>
            </div>
        </div>
    )
}
