import { useNavigate } from 'react-router-dom';
import { useState, useRef } from 'react';
import { useUserContext } from '../context/userContext.jsx';
import { useAuth } from '../hooks/auth.hooks.jsx'
import { Bell, Settings, LogOut, User } from 'lucide-react';

export function NavBar(){
    const { logoutMutation } = useAuth();
    const { nameInitials, isLoading } = useUserContext();
    const navigate = useNavigate();

    return(
        <nav className='dashboardNav'>
            <div className='navLeft'>
                <div 
                    className='navLogo' 
                    onClick={() => navigate('/dashboard')}
                >
                    <span className='navLogoIcon'>⚡</span> VOLT
                </div>
            </div>
            <div className='navRight'>
                <button 
                    className='createQuoteBtn'
                    onClick={() => navigate('/create-quote')}    
                >
                    + New Quote
                </button>
                <NavHoverPopUp content={
                    <div className='navPopUpActions'>
                            <button 
                                className='navPopBtns' 
                                onClick={() => navigate('/notifications')}
                            >
                                alerts
                            </button>
                        <button className='navPopBtns'>settings</button>
                        <button
                            onClick={() => logoutMutation.mutate()}
                            // disabled={logoutMutation.isPending}
                            className='navPopBtns'   
                        >
                            log out
                        </button>
                    </div>
                }>
                    <div 
                        className='profileContainer'
                        onClick={() => navigate('/profile')}    
                    >
                        <h3>
                            { isLoading ? <User /> : nameInitials}
                        </h3>
                    </div>
                </NavHoverPopUp>
            </div>
        </nav>
    )
}

export function CqNavBar({ handleSaveQuote, handleStatusChange, statusValue }){
    const navigate = useNavigate()
    const options= [
        {label: 'Draft', value: 'draft'},
        {label: 'Pending', value: 'pending'},
        {label: 'Approved', value: 'approved'},
        {label: 'Completed', value: 'completed'}
    ]

    return(
        <nav className='createQuoteNav'>
            <div className='cqNavLeft'>
               <div 
                    className='navLogo' 
                    onClick={() => navigate('/dashboard')}
                >
                    <span className='navLogoIcon'>⚡</span> VOLT
                </div>
            </div>
            <div className='cqNavRight'>
                <select name="selectedQuoteStatus" className='quoteStatusSelect' value={statusValue} onChange={handleStatusChange}>
                    {options.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}    
                </select>
                {/* <button className='cqChangeOrderBtn'>+ Change Order</button> */}
                <button className='cqSendQuoteBtn' onClick={handleSaveQuote}>
                    Save Quote
                </button>
            </div>
        </nav>
    )
}

function NavHoverPopUp({children, content}){
    const [isVisible, setIsVisible] = useState(false);
    const timeOutRef = useRef(null);

    function mouseEnter(){
        clearTimeout(timeOutRef.current);
        setIsVisible(true)
    }
    
    function mouseLeave(){
        timeOutRef.current = setTimeout(() => {
            setIsVisible(false)
        }, 300)
    }

    return(
        <div 
        className='navPopUpContainer'
        onMouseEnter={mouseEnter}
        onMouseLeave={mouseLeave}
        >
            { children }
            {isVisible && <div className='navPopUpContent'>{ content }</div>}
        </div>
    )
}

export function SettingsPage(){
    return(
        <div>

        </div>
    )
}
