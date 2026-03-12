import { useState, useEffect } from 'react';
import { QuickAccess } from '../comps/dashboard/quickAccess.jsx';
import { CustomerTable } from '../comps/dashboard/customersTable.jsx';

export function Dashboard(){
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
                    <button className='createQuoteBtn'>+ New Quote</button>
                    <div className='profileContainer'>JD</div>
                </div>
            </nav>

            <div className='dashboardBody'>
                <div className='quickAccessContainer'>
                    <QuickAccess />
                </div>

                <div className='filterRow'>
                    <div className='statusBtnsContainer'>
                        <button className='statusBtns active'>All</button>
                        <button className='statusBtns'>Draft</button>
                        <button className='statusBtns'>Sent</button>
                        <button className='statusBtns'>Approved</button>
                        <button className='statusBtns'>In Progress</button>
                        <button className='statusBtns'>Completed</button>
                    </div>
                    <input className='searchInput' placeholder='Search jobs...' />
                </div>

                <div className='customerTableContainer'>
                    <CustomerTable />
                </div>
            </div>
        </div>
    )
}
