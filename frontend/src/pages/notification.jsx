import { useState } from 'react';
import { useNotiHook } from "../hooks/notifications.hooks.jsx";
import { Check, Clock, PiggyBank } from 'lucide-react';
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

const filterMap = {
    'APPROVED': 'Approved',
    'FOLLOW UP': 'Follow Up',
    'UNPAID': 'Unpaid',
    'COMPLETE': 'Complete'
}

export function NotificationsPage(){
    const [activeFilter, setActiveFilter] = useState('ALL');
    const [clear, setClear] = useState(false);
    const [notiPage, setNotiPage] = useState(1); 
    const notiLimit = 12;
    const { notifications, isLoading, isError, error } = useNotiHook({notiPage, notiLimit, clear});
    const notiFilter = ['ALL', 'APPROVED', 'FOLLOW UP', 'UNPAID'];
    const notiData = activeFilter === 'ALL' ? notifications : notifications.filter(n => n.type == filterMap[activeFilter])

    return(
        <div className='notiPage'>
            <NavBar />
            <div className="notiContainer">
                <header className="notiHead">
                    <div className='notiHeadContent'>
                        <h2>Notifications</h2>
                        <div className='notiActionBtns'>
                            <button>Mark All Seen </button>
                            <button onClick={() => setClear(true)}>Clear</button>
                        </div>
                    </div>
                    <div className="notiFilterContainer">
                        {notiFilter.map(btns => (
                            <button
                                key={btns}
                                className={`notiFilterBtn ${activeFilter === btns ? 'active' : ''}`}
                                onClick={() => setActiveFilter(btns)}
                            >
                                {btns}
                            </button>
                        ))}
                    </div>
                </header>
                <div className='notiList'>
                    {notifications.length === 0 ?
                        <p>No Notifications</p> :
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
    )
}
