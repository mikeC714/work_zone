import { useState } from 'react';
import { useNotiHook } from "../hooks/notifications.hooks.jsx";
import { Check, Clock, PiggyBank, ChevronRight, ChevronLeft } from 'lucide-react';
import { NavBar } from '../comps/navBar.jsx'

const notiConfig = {
    'Approved': {
        icon: <Check />,
        style: 'notiApproved',
        color: '#abf7b1'
    },
    // 'Complete': {
    //     icon,
    //     style,
    //     color
    // }
    // ,
    'Follow Up': {
        icon: <Clock />,
        style: 'notiFollowup',
        color: '#FFFFE0'
    },
    'Unpaid': {
        icon: <PiggyBank />,
        style: 'notiUnpaid',
        color: '#FF7F7F'
    }
}

export function NotificationsPage(){
    const [activeFilter, setActiveFilter] = useState('ALL');
    const [clear, setClear] = useState(false);
    const [notiPage, setNotiPage] = useState(1); 
    const notiLimit = 12;
    const { notifications, paginated, isLoading, isError } = useNotiHook({notiPage, notiLimit, activeFilter, clear});
    const notiFilter = ['ALL', 'APPROVED', 'FOLLOW UP', 'UNPAID'];

    return(
        <div className='notiPage'>
            <NavBar />
            <div className="notiContainer">
                <header className="notiHead">
                    <div className='notiHeadContent'>
                        <div className='notiActionBtns'>
                            <button onClick={() => {
                                setClear(true)
                                }}>CLEAR</button>
                        </div>
                    </div>
                    <div className="notiFilterContainer">
                        {notiFilter.map(btns=> (
                            <button
                                key={btns}
                                className={`notiFilterBtn ${activeFilter === btns ? 'active' : ''}`}
                                onClick={() => setActiveFilter(btns)}
                            >
                                {btns}
                            </button>
                        ))}
                    </div>
					<div className='notiPaginationContainer'>
						<button
							onClick={() => setNotiPage(p => p - 1)}		
							disabled={paginated?.prevPage ? false : true}
							className='notiPaginationBtn'
							>
								<ChevronLeft />
							</button>
						<button
							onClick={() =>  setNotiPage(p => p +1)}	
							disabled={paginated?.nextPage ? false : true}
							className='notiPaginationBtn'
							>
								<ChevronRight />
							</button>
					</div>
                </header>
        	    <div className='notiListContainer'>    
					<div className='notiList'>
                    	{notifications.length === 0 ?
                        	<p className='noNotiMsg'>No Notifications</p> :
                        	notifications.map(noti => {
                            	const { icon, style, color } = notiConfig[noti.type]
                            	return(
                                	<div key={noti.quoteId} className={`notiContent ${style}`} style={{borderLeft:`3.2px solid ${color}`}}>
                                    	<span className='notiIcon' style={{color, background: `${color}20`}}>{icon}</span>
                                    	<div className="notiContent">
                                        	<div className="notiConTop">
                                            	<p>{noti.type}</p>
                                        	</div>
                                        	<div className="notiConCen">
                                            	<p className='notiMsg'>{noti.message}</p>
                                            	<p className='notiPrice'>{noti.price}</p>
                                        	</div>
                                        	<div className="notiConBtm">
                                            	<div className="notiTypeContainer" style={{color, background:`${color}20`}}>{noti.type}</div>
                                        	</div>
                                    	</div>
                                	</div>
                            	)
                        	})
                    	}
                	</div>
				</div>
            </div>
        </div>
    )
}
