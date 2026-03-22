import { useState } from 'react';
import { useNotiHook } from "../../hooks/notifications.hooks.jsx";
import { Check, Clock, PiggyBank } from 'lucide-react';
import { NavBar } from '../navBar/navBar.jsx'

const notiConfig = {
    'Approved': {
        icon: <Check />,
        style: 'noti-approved'
    },
    'FollowUp': {
        icon: <Clock />,
        style: 'noti-followup'
    },
    'Unpaid': {
        icon: <PiggyBank />,
        style: 'noti-unpaid'
    }
}

export function NotificationsPage(){
    const [activeFilter, setActiveFilter] = useState('ALL')
    const notiFilter = ['ALL', 'APPROVED', 'FOLLOW UP', 'UNPAID']
    // const { notifications } = useNotiHook();

    const notifications = [
        // {   
        //     type: 'Approved', 
        //     message: `Quote for Joe Smith has been approved`,
        //     customerId: 1234,
        //     quoteId: 'QT-1234',
        //     title: `Quote # QT-1234 Approved`,
        //     price: '$1,200',
        //     read: false
        // }
    ]

    const notiData = activeFilter === 'ALL'
    ? notifications :
    notifications.map(noti => ({
        ...noti,
        notis: noti.filter(n => n.type == activeFilter.toLowerCase())
    }))

    return(
        <div className='notiPage'>
            <NavBar />
            <div className="notiContainer">
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
                     <div className='notiActionBtns'>
                            <button>Mark All Seen </button>
                            <button>Clear</button>
                        </div>
                </div>
                <div className='notiList'>
                    {notifications.length === 0 ?
                        <p>No Notifications</p> :
                        notiData.map(noti => {
                            const { icon, style } = notiConfig[noti.type]
                            return(
                                <div key={noti.quoteId} className={`notiContainer ${style}`}>
                                    <span className='notiIcon'>{icon}</span>
                                    <div className="notiContent">
                                        <div className="notiConTop">
                                            <p>{noti.title}</p>
                                        </div>
                                        <div className="notiConCen">
                                            <p className='notiMsg'>{noti.message}</p>
                                        </div>
                                        <div className="notiConBtm">
                                            <p className='notiMsg'>{noti.type}</p>
                                            <p className='notiMsg'>{noti.price}</p>
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
