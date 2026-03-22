import { Link } from 'react-router-dom';
import { useState, useRef } from 'react';
import { useUserContext } from '../../context/userContext.jsx';
import { useNotiHook } from "../../hooks/notifications.hooks.jsx";

export function NavBar({ logoutMutation }){
    const { nameInitials } = useUserContext();
    const { data, isLoading, isError, error } = useNotiHook();

    console.log(data);
    
    return(
        <nav className='dashboardNav'>
            <div className='navLeft'>
                <div className='navLogo'>
                    <Link to='/'>
                        <span className='navLogoIcon'>⚡</span> VOLT
                    </Link>
                </div>
                {/* <button 
                >Logoout</button> */}
            </div>
            <div className='navRight'>
                <Link to="/createQuote">
                    <button className='createQuoteBtn'>+ New Quote</button>
                </Link>
                <NavHoverPopUp content={
                    <div className='navPopUpActions'>
                        <button
                            onClick={() => logoutMutation.mutate()}
                            disabled={logoutMutation.isPending}>
                            NOTIFICATIONS
                        </button>
                        <button>SETTINGS</button>
                        <button>LOGOUT</button>
                    </div>
                }>
                    <Link to="/profile">
                        <div className='profileContainer'>
                            <h3>
                                {nameInitials}
                            </h3>
                        </div>
                    </Link>
                </NavHoverPopUp>
            </div>
        </nav>
    )
}

export function CqNavBar({ handleSaveQuote }){
    return(
        <nav className='createQuoteNav'>
            <div className='cqNavLeft'>
                <Link to="/">
                    <span className='cqNavBrand'>VOLT</span>
                </Link>
            </div>
            <div className='cqNavRight'>
                <select name="selectedQuoteStatus" className='quoteStatusSelect'>
                    <option value="draft">Draft</option>
                    <option value="inProgress">In Progress</option>
                    <option value="approved">Approved</option>
                    <option value="completed">Completed</option>
                </select>
                <button className='cqChangeOrderBtn'>+ Change Order</button>
                <button className='cqSendQuoteBtn' type='submit' onClick={handleSaveQuote}>
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
export function NotificationsPage(){
    return(
        <div className='notiPage'>
            <div className='noti'>

            </div>
        </div>
    )
}