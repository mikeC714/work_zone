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
    'UNPAID': 'Unpaid'
}

export function NotificationsPage(){
    const [activeFilter, setActiveFilter] = useState('ALL')
    const notiFilter = ['ALL', 'APPROVED', 'FOLLOW UP', 'UNPAID']
    // const { notifications } = useNotiHook();

    const notifications = [
        {   
            type: 'Approved', 
            message: `Alex Smith has been approved Quote QT-121`,
            customerId: 1234,
            quoteId: 'QT-121',
            title: `Quote # QT-1234 Approved`,
            price: '$1,200',
            read: false
        },
        {   
            type: 'Follow Up', 
            message: `Joe Shmoe has been approved Quote QT-122`,
            customerId: 1234,
            quoteId: 'QT-122',
            title: `Quote # QT-125 Approved`,
            price: '$1,200',
            read: false
        },
        {   
            type: 'Unpaid', 
            message: `John Jones has been approved Quote QT-123`,
            customerId: 1234,
            quoteId: 'QT-123',
            title: `Quote # QT-1234 Approved`,
            price: '$1,200',
            read: false
        }
    ]

    const notiData = activeFilter === 'ALL'
    ? notifications :
    notifications.filter(n => n.type == filterMap[activeFilter])

    return(
        <div className='notiPage'>
            <NavBar />
            <div className="notiContainer">
                <header className="notiHead">
                    <div className='notiHeadContent'>
                        <h2>Notifications</h2>
                        <div className='notiActionBtns'>
                            <button>Mark All Seen </button>
                            <button>Clear</button>
                        </div>
                    </div>
                </header>
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
                <div className='notiList'>
                    {notifications.length === 0 ?
                        <p>No Notifications</p> :
                        notiData.map(noti => {
                            const { icon, style, color } = notiConfig[noti.type]
                            return(
                                <div key={noti.quoteId} className={`notiContent ${style}`} style={{borderLeft:`3.2px solid ${color}`}}>
                                    <span className='notiIcon' style={{color, background: `${color}20`}}>{icon}</span>
                                    <div className="notiContent">
                                        <div className="notiConTop">
                                            <p>{noti.title}</p>
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
