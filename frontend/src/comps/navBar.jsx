import { Link } from 'react-router-dom';
import { useUserContext } from '../context/userContext.jsx';


export function NavBar({ logoutMutation }){
    const { nameInitials } = useUserContext();

    return(
        <nav className='dashboardNav'>
            <div className='navLeft'>
                <div className='navLogo'>
                    <Link to='/'>
                        <span className='navLogoIcon'>⚡</span> VOLT
                    </Link>
                </div>
                {/* <button 
                onClick={() => logoutMutation.mutate()}
                disabled={logoutMutation.isPending}>Logoout</button> */}
            </div>
            <div className='navRight'>
                <Link to="/createQuote">
                    <button className='createQuoteBtn'>+ New Quote</button>
                </Link>
                <Link to="/profile">
                    <div className='profileContainer'>
                        <h3>
                            {nameInitials}
                        </h3>
                    </div>
                </Link>
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