import { useState } from 'react';
import { Link } from 'react-router-dom';

const user = {
    initials: 'JM',
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
    return (
        <div className='profileOverviewCard'>
            <section className='profileInfoSection'>
                <h4 className='profileSectionLabel'>Personal Information</h4>
                <div className='profileInfoGrid'>
                    <div className='profileInfoField'>
                        <span className='profileFieldLabel'>Full Name</span>
                        <span className='profileFieldValue'>{user.name}</span>
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

    return (
        <div className='profilePage'>
            <nav className='dashboardNav'>
                <div className='navLeft'>
                    <Link to="/">
                        <div className='navLogo'>
                            <span className='navLogoIcon'>⚡</span>
                            VOLT
                        </div>
                    </Link>
                </div>
                <div className='navRight'>
                    <Link to="/createQuote">
                        <button className='createQuoteBtn'>+ New Quote</button>
                    </Link>
                    <div className='profileContainer'>{user.initials}</div>
                </div>
            </nav>

            <div className='profileBody'>
                <div className='profileHeaderCard'>
                    <div className='profileHeaderLeft'>
                        <div className='profileAvatar'>{user.initials}</div>
                        <div className='profileHeaderInfo'>
                            <div className='profileNameRow'>
                                <h2 className='profileName'>{user.name}</h2>
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
                    <div className='profileStatCard'>
                        <span className='profileStatIcon'>📦</span>
                        <span className='profileStatValue'>{user.stats.activeJobs}</span>
                        <span className='profileStatLabel'>ACTIVE JOBS</span>
                    </div>
                    <div className='profileStatCard'>
                        <span className='profileStatIcon'>📋</span>
                        <span className='profileStatValue'>{user.stats.completedJobs}</span>
                        <span className='profileStatLabel'>COMPLETED JOBS</span>
                    </div>
                    <div className='profileStatCard'>
                        <span className='profileStatIcon'>🏭</span>
                        <span className='profileStatValue'>{user.stats.monthlyRevenue}</span>
                        <span className='profileStatLabel'>MONTHLY REVENUE</span>
                    </div>
                    <div className='profileStatCard'>
                        <span className='profileStatIcon'>⭐</span>
                        <span className='profileStatValue'>{user.stats.memberSince}</span>
                        <span className='profileStatLabel'>MEMBER SINCE</span>
                    </div>
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
