import { useState } from "react";
import { useAuth } from '../hooks/auth.hooks.jsx';
import { AuthForm } from '../comps/auth/authForm.jsx';

export function Authentication() {
    const [isAuth, setAuth] = useState(true);
    const { loginMutation, signupMutation } = useAuth();

    function handleSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const credentials = Object.fromEntries(formData);
        isAuth ? loginMutation.mutate(credentials) : signupMutation.mutate(credentials);
    }

    return (
        <div className="authPage">

            <div className="authLeft">

                <div className="authLogo">
                    <span className="authLogoIcon">⚡</span>
                    <span>VOLT</span>
                </div>

                <div className="authTopSection">
                    <div className="authTabs">
                        <button className={`authTab ${isAuth ? 'active' : ''}`} onClick={() => setAuth(true)}>
                            Sign In
                        </button>
                        <button className={`authTab ${!isAuth ? 'active' : ''}`} onClick={() => setAuth(false)}>
                            Sign Up
                        </button>
                    </div>

                    <div className="authHeader">
                        <h1>{isAuth ? 'Welcome Back' : 'Create Account'}</h1>
                        <p>{isAuth ? 'Sign in to manage your jobs and quotes' : 'Sign up to start managing your business'}</p>
                    </div>
                </div>

                <AuthForm
                    key={isAuth}
                    isAuth={isAuth}
                    onSubmit={handleSubmit}
                    isPending={isAuth ? loginMutation.isPending : signupMutation.isPending}
                    onSwitch={() => setAuth(prev => !prev)}
                />

            </div>

            <div className="authRight">

                <div className="mockWindow">
                    <div className="mockWindowBar">
                        <span className="mockDot mockDotRed" />
                        <span className="mockDot mockDotYellow" />
                        <span className="mockDot mockDotGreen" />
                    </div>
                    <div className="mockStats">
                        <div className="mockStatCard">
                            <span className="mockStatLabel">Active Jobs</span>
                            <span className="mockStatValue">24</span>
                        </div>
                        <div className="mockStatCard">
                            <span className="mockStatLabel">Pending Quotes</span>
                            <span className="mockStatValue">12</span>
                        </div>
                        <div className="mockStatCard mockStatAccent">
                            <span className="mockStatLabel">Revenue</span>
                            <span className="mockStatValue">$14.2k</span>
                        </div>
                    </div>
                    <div className="mockJobs">
                        <div className="mockJobsHeader">
                            <span>Recent Jobs</span>
                            <span className="mockViewAll">View All</span>
                        </div>
                        <div className="mockJobItem">
                            <div className="mockJobIcon mockJobIconOrange">⚡</div>
                            <div className="mockJobInfo">
                                <span className="mockJobTitle">Panel Upgrade – Smith Res.</span>
                                <span className="mockJobSub">Scheduled: Today, 2:00 PM</span>
                            </div>
                            <span className="mockBadge mockBadgeGreen">In Progress</span>
                        </div>
                        <div className="mockJobItem">
                            <div className="mockJobIcon mockJobIconBlue">📋</div>
                            <div className="mockJobInfo">
                                <span className="mockJobTitle">Commercial Wiring Quote</span>
                                <span className="mockJobSub">Sent: Yesterday</span>
                            </div>
                            <span className="mockBadge mockBadgeYellow">Pending</span>
                        </div>
                    </div>
                </div>

                <div className="authRightText">
                    <h2>Run your electrical business from one place</h2>
                    <p>Quotes, customers, and job tracking — all in sync.</p>
                    <div className="authBadges">
                        <span className="authBadge">⚡ Live Job Tracking</span>
                        <span className="authBadge">📊 Instant Quotes</span>
                        <span className="authBadge">💳 Payment Ready</span>
                    </div>
                </div>

            </div>

        </div>
    );
}
