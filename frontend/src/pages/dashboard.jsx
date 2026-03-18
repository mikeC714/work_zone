import { useState, useEffect } from 'react';
import { QuickAccess } from '../comps/dashboard/quickAccess.jsx';
import { customerTableData } from '../hooks/customerTable.hooks.jsx'
import { CustomerTable } from '../comps/dashboard/customersTable.jsx';
import { Link } from 'react-router-dom';

export function Dashboard(){
    const [activeFilter, setActiveFilter] = useState('ALL');
    const filters = ['ALL','DRAFT','SENT', 'IN PROGRESS', 'APPROVED', 'COMPLETED']

    const filteredData = activeFilter === 'ALL' 
    ? customerTableData :
    customerTableData.map(cus => ({ 
        ...cus,
        quote: cus.quote.filter(qt => qt.status === activeFilter.toLowerCase().replace(' ', '_'))
    }))
    .filter(cus => cus.quote.length > 0)

    return(
        <div className='dashboardPage'>
            <nav className='dashboardNav'>
                <div className='navLeft'>
                    <div className='navLogo'>
                        <span className='navLogoIcon'>⚡</span>
                        VOLT
                    </div>
                </div>
                <div className='navRight'>
                    <Link to="/createQuote">
                        <button className='createQuoteBtn'>+ New Quote</button>
                    </Link>
                    <div className='profileContainer'>JD</div>
                </div>
            </nav>

            <div className='dashboardBody'>
                <div className='quickAccessContainer'>
                    <QuickAccess />
                </div>

                <div className='filterRow'>
                    <div className='statusBtnsContainer'>
                        {filters.map(btns => (
                            <button 
                            className={`statusBtns ${activeFilter === btns ? 'active' : ''}`}
                            key={btns} 
                            onClick={() => (setActiveFilter(btns))}>
                                {btns}
                            </button>
                        ))}
                    </div>
                    <input className='searchInput' placeholder='Search jobs...' />
                </div>

                <div className='customerTableContainer'>
                    <CustomerTable 
                        filteredData={filteredData}
                    />
                </div>
            </div>
        </div>
    )
}
