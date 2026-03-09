import { useState, useEffect } from 'react';
import { QuickAccess } from '../comps/dashboard/quickAccess.jsx';
// import { CustomerTable } from '../comps/dashboard/customersTable.jsx';

export function Dashboard(){
    return(
        <div>
            <header>
                <div className='leftHeader'>

                </div>
                <div className='rightHeader'>
                    <button className='createQuoteBtn'>New Quote</button>
                    <div className='profileContainer'></div>
                </div>
            </header>

            <div className='quickAccessContainer' >
                <QuickAccess />
            </div>

            <div className='statusBtnsContainer'>
                <button className='statusBtns'>All</button>
                <button className='statusBtns'>Sent</button>
                <button className='statusBtns'>Approved</button>
                <button className='statusBtns'>In Progress</button>
                <button className='statusBtns'>Completed</button>
            </div>

            <div className='customerTableContainer' >
                {/* <CustomerTable /> */}
            </div>

        </div>
    )
}