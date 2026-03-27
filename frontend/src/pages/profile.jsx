import { useState } from 'react';
import { useQueries } from '@tanstack/react-query';
import { NavBar } from '../comps/navBar.jsx';
import { quickAccessQueries } from '../hooks/quickAccess.hooks.jsx';
import { useUserContext } from '../context/userContext.jsx';
import { useNotiHook } from '../hooks/notifications.hooks.jsx'
import { HandCoins, Briefcase, BookCheck, Star, Check, Clock, PiggyBank } from 'lucide-react';

const user = {
    name: 'Jordan Mitchell',
    title: 'Warehouse Manager',
    department: 'Operations',
    location: 'Baltimore, MD — Warehouse B',
    lastLogin: 'Today at 9:14 AM',
    email: 'jordan.mitchell@acme-corp.com',
    phone: '+1 (443) 555-0192',
    employeeId: 'EMP-00423',
    role: 'Warehouse Manager',
    joined: 'March 12, 2022',
    stats: {
        activeJobs: '120',
        completedJobs: '10',
        monthlyRevenue: '342',
        memberSince: '3 yrs',
    }
};

function Overview() {
    const { firstName, lastName } = useUserContext();
    const fullName = firstName + " " + lastName

    return (
        <div className='profileOverviewCard'>
            <section className='profileInfoSection'>
                <h4 className='profileSectionLabel'>Personal Information</h4>
                <div className='profileInfoGrid'>
                    <div className='profileInfoField'>
                        <span className='profileFieldLabel'>Full Name</span>
                        <span className='profileFieldValue'>{fullName}</span>
                    </div>
                    <div className='profileInfoField'>
                        <span className='profileFieldLabel'>Email Address</span>
                        <span className='profileFieldValue'>{user.email}</span>
                    </div>
                    <div className='profileInfoField'>
                        <span className='profileFieldLabel'>Phone Number</span>
                        <span className='profileFieldValue'>{user.phone}</span>
                    </div>
                    <div className='profileInfoField'>
                        <span className='profileFieldLabel'>Department</span>
                        <span className='profileFieldValue'>{user.department}</span>
                    </div>
                </div>
            </section>

            <div className='profileSectionDivider' />

            <section className='profileInfoSection'>
                <h4 className='profileSectionLabel'>Work Details</h4>
                <div className='profileInfoGrid'>
                    <div className='profileInfoField'>
                        <span className='profileFieldLabel'>USER ID</span>
                        <span className='profileFieldValue profileMonospace'>{user.employeeId}</span>
                    </div>
                    <div className='profileInfoField'>
                        <span className='profileFieldLabel'>Role</span>
                        <span className='profileFieldValue'>{user.role}</span>
                    </div>
                    <div className='profileInfoField'>
                        <span className='profileFieldLabel'>Primary Location</span>
                        <span className='profileFieldValue'>{user.location}</span>
                    </div>
                    <div className='profileInfoField'>
                        <span className='profileFieldLabel'>Joined</span>
                        <span className='profileFieldValue'>{user.joined}</span>
                    </div>
                </div>
            </section>

        </div>
    );
}

function Account() {
    return (
        <div className='pAccountContainer'>
            
        </div>
    );
}


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


function Notifications() {
    const { notifications, isLoading, isError, error } = useNotiHook();
    console.log(notifications)
    return(
        <div className="pNotiContainer">
            <div className="pNotiBtns">
                <button>Read All</button>
                <button>Clear</button>
            </div>
            <div className="pNotiList">
                { notifications.length === 0 ? 
                    <p>No Notifications</p> :
                    notifications.map((noti, i) => {
                        const { icon, style, color } = notiConfig[noti.type]
                        return(
                            <div key={i} className={`pNotis ${style}`} style={{borderLeft:`3.2px solid ${color}`}}>
                                <span className="pNotiIcon" style={{color, background: `${color}20`}}>{icon}</span>
                                <div className="pNotiContent">
                                    <div className="pNotiHead">Filler Title </div>
                                    <div className="pNotiMid">
                                        <p className='pNotiMsg'>{noti.message}</p>
                                    </div>
                                    <div className='pNotiLow'>
                                        <p className='pNotiPrice'>$1,200</p>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
} 

const viewMap = {
    overview: <Overview />,
    notifications: <Notifications />,
    account: <Account />,
};

export function ProfilePage() {
    const [currView, setCurrView] = useState('overview');
    const { firstName, lastName, nameInitials } = useUserContext()
    const fullName = firstName + " " + lastName

    const quickAccessData = useQueries({ queries: quickAccessQueries })
    const [ monthlyRevenue, completedJobs, activeJobs, unpaidJobs ] = quickAccessData.map(data => data.data);
    const isLoading = quickAccessData.some(data => data.isLoading)
    const isError = quickAccessData.some(data => data.isError);
    

    return (
        <div className='profilePage'>
            <NavBar />
            <div className='profileBody'>
                <div className='profileHeaderCard'>
                    <div className='profileHeaderLeft'>
                        <div className='profileAvatar'>{nameInitials}</div>
                        <div className='profileHeaderInfo'>
                            <div className='profileNameRow'>
                                <h2 className='profileName'>{fullName}</h2>
                                <span className='profileActiveBadge'>● ACTIVE</span>
                            </div>
                            <p className='profileSubtitle'>
                                {user.title}
                                <span className='profileSubDot'>·</span>
                                {user.department}
                                <span className='profileSubDash'>—</span>
                                {user.location}
                            </p>
                            <p className='profileLastLogin'>
                                Last login: <span>{user.lastLogin}</span>
                            </p>
                        </div>
                    </div>
                    <button className='editProfileBtn'>✏ Edit Profile</button>
                </div>
                <div className='profileStatsRow'>
                    <ProfileCard
                        icon={<Briefcase />}
                        value={activeJobs}
                        isLoading={isLoading}
                        isError={isError}
                        label='ACTIVE JOBS'
                    /> 
                    <ProfileCard
                        icon={<BookCheck />}
                        value={completedJobs}
                        isLoading={isLoading}
                        isError={isError}
                        label='COMPLETED JOBS'
                     />
                    <ProfileCard
                        icon={<HandCoins />}
                        value={`$ ${monthlyRevenue}`}
                        isLoading={isLoading}
                        isError={isError}
                        label='MONTHLY REVENUE'
                     />
                    <ProfileCard
                        icon={<Star />}
                        value={null}
                        isLoading={isLoading}
                        isError={isError}
                        label='MEMBER SINCE'
                     />
                </div>
                <div className='profileTabSection'>
                    <div className='profileTabs'>
                        {['overview', 'notifications', 'account'].map(tab => (
                            <button
                                key={tab}
                                className={`profileTab ${currView === tab ? 'active' : ''}`}
                                onClick={() => setCurrView(tab)}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </div>
                    <div className='profileTabContent'>
                        {viewMap[currView]}
                    </div>
                </div>
            </div>
        </div>
    );
}

function ProfileCard({ icon, value, label, isLoading, isError }){
    return(
        <div className='profileStatCard'>
            <span className='profileStatIcon'>{icon}</span>
            {isLoading ? (
                <span className="profileStatValue">—</span>
            ): isError ? (
                <span className="profileStatValue">—</span>
            ): (
                <span className="profileStatValue">{value ?? 0}</span>
            )}
            {label && <span className='profileStatLabel'>{label}</span>}
        </div>
    )
}