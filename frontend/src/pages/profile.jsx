import { useState } from 'react';
import { useQueries } from '@tanstack/react-query';
import { NavBar } from '../comps/navBar.jsx';
import { quickAccessQueries } from '../hooks/quickAccess.hooks.jsx';
import { useUserContext } from '../context/userContext.jsx';
import { HandCoins, Briefcase, BookCheck, Star } from 'lucide-react';

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

function Security() {
    return (
        <div className='profileOverviewCard'>
            <p className='profilePlaceholderTxt'>Security settings coming soon.</p>
        </div>
    );
}

function Notifications() {
    return (
        <div className='profileOverviewCard'>
            <p className='profilePlaceholderTxt'>Notification settings coming soon.</p>
        </div>
    );
}

const viewMap = {
    overview: <Overview />,
    security: <Security />,
    notifications: <Notifications />,
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
                        {['overview', 'security', 'notifications'].map(tab => (
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
