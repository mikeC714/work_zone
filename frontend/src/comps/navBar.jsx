import { useNavigate } from 'react-router-dom';
import { useState, useRef } from 'react';
import { useUserContext } from '../context/userContext.jsx';

export function NavBar({ logoutMutation }){
    const { nameInitials } = useUserContext();
    const navigate = useNavigate()
    return(
        <nav className='dashboardNav'>
            <div className='navLeft'>
                <div 
                    className='navLogo' 
                    onClick={() => navigate('/')}
                >
                    <span className='navLogoIcon'>⚡</span> VOLT
                </div>
            </div>
            <div className='navRight'>
                <button 
                    className='createQuoteBtn'
                    onClick={() => navigate('/createQuote')}    
                >
                    + New Quote
                </button>
                <NavHoverPopUp content={
                    <div className='navPopUpActions'>
                            <button 
                                className='navPopBtns' 
                                onClick={() => navigate('/notifications')}
                            >
                                NOTIFICATIONS
                            </button>
                        <button className='navPopBtns'>SETTINGS</button>
                        <button
                            onClick={() => logoutMutation.mutate()}
                            // disabled={logoutMutation.isPending}
                            className='navPopBtns'   
                        >
                            LOGOUT
                        </button>
                    </div>
                }>
                    <div 
                        className='profileContainer'
                        onClick={() => navigate('/profile')}    
                    >
                        <h3>
                            {nameInitials}
                        </h3>
                    </div>
                </NavHoverPopUp>
            </div>
        </nav>
    )
}

export function CqNavBar({ handleSaveQuote }){
    const navigate = useNavigate()
    return(
        <nav className='createQuoteNav'>
            <div className='cqNavLeft'>
                <span 
                    className='cqNavBrand'
                    onClick={() => navigate('/')}
                >
                    VOLT
                </span>
            </div>
            <div className='cqNavRight'>
                <select name="selectedQuoteStatus" className='quoteStatusSelect'>
                    <option value="draft">Draft</option>
                    <option value="inProgress">In Progress</option>
                    <option value="approved">Approved</option>
                    <option value="completed">Completed</option>
                </select>
                <button className='cqChangeOrderBtn'>+ Change Order</button>
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
