import { useState, useMemo } from 'react';
import { QuickAccess } from '../comps/dashboard/quickAccess.jsx';
import { useCustomerTableHook} from '../hooks/customerTable.hooks.jsx';
import { CustomerTable } from '../comps/dashboard/customersTable.jsx'
import { NavBar } from '../comps/navBar.jsx';

export function Dashboard(){
    const [activeFilter, setActiveFilter] = useState('ALL');
    const [searchFilter, setSearchFilter] = useState('');
    const { filteredData, pagination, isLoading, isError, error } = useCustomerTableHook({activeFilter, searchFilter});
    const filters = ['ALL','DRAFT','SENT', 'PENDING', 'APPROVED', 'COMPLETED']

    function handleSearchChange(e){
        setSearchFilter(e.target.value);
    }

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
                    <input 
                        className='searchInput' 
                        placeholder='Search jobs...' 
                        value={searchFilter}
                        onChange={handleSearchChange}
                    />
                </div>

                <div className='customerTableContainer'>
                    <CustomerTable 
                        filteredData={filteredData}
                        pagination={pagination}
                    />
                </div>
            </div>
        </div>
    )
}
