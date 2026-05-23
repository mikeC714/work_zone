import { useState, useMemo, useEffect } from 'react';
import { QuickAccess } from '../comps/dashboard/quickAccess.jsx';
import { useCustomerTableHook, useCustomerDelete } from '../hooks/customerTable.hooks.jsx';
import { CustomerTable } from '../comps/dashboard/customersTable.jsx'
import { NavBar } from '../comps/navBar.jsx';

export function Dashboard(){
    const [activeFilter, setActiveFilter] = useState('ALL');
    const [searchFilter, setSearchFilter] = useState('');
    const [page, setPage] = useState(1);
    const { filteredData, paginated, isLoading, isError, error } = useCustomerTableHook({activeFilter, searchFilter, page});
    const { mutate, isPending: deletePending, isError: deleteFail } = useCustomerDelete();
    const filters = ['ALL','DRAFT','SENT', 'PENDING', 'APPROVED', 'COMPLETED', 'UNPAID'];
    const statusArr = ['DRAFT','SENT', 'PENDING', 'APPROVED', 'COMPLETED', 'UNPAID'];

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
                                onClick={() => {
                                    setActiveFilter(btns);
                                    setPage(1);
                                }}>
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
                        data={filteredData}
                        page={paginated}
                        currPage={page}
                        setPage={setPage}
                        handleDelete={mutate}
                    />
                </div>
            </div>
        </div>
    )
}
