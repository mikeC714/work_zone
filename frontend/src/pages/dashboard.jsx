import { useState, useEffect } from 'react';
import { QuickAccess } from '../comps/dashboard/quickAccess.jsx';
import { useCustomerTableHook} from '../hooks/customerTable.hooks.jsx';
import { CustomerTable } from '../comps/dashboard/customersTable.jsx'
import { NavBar } from '../comps/navBar.jsx';

export function Dashboard(){
    const [activeFilter, setActiveFilter] = useState('ALL');
    const { data, isLoading, isError, error } = useCustomerTableHook();
    const filters = ['ALL','DRAFT','SENT', 'PENDING', 'APPROVED', 'COMPLETED']

    const filteredData = activeFilter === 'ALL' 
    ? data?.customers :
    data?.customers?.map(cus => ({ 
        ...cus,
        quote: cus.quote.filter(qt => qt.status === activeFilter.toLowerCase().replace(' ', '_'))
    }))
    .filter(cus => cus.quote.length > 0)

    console.log(filteredData)

    return(
        <div className='dashboardPage'>
            <NavBar />
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
                                onClick={() => setActiveFilter(btns)}>
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
