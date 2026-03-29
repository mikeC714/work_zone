import { useState, useMemo } from 'react';
import { QuickAccess } from '../comps/dashboard/quickAccess.jsx';
import { useCustomerTableHook} from '../hooks/customerTable.hooks.jsx';
import { CustomerTable } from '../comps/dashboard/customersTable.jsx'
import { NavBar } from '../comps/navBar.jsx';

export function Dashboard(){
    const [activeFilter, setActiveFilter] = useState('ALL');
    const [searchFilter, setSearchFilter] = useState('');
    const { data, isLoading, isError, error } = useCustomerTableHook();
    const filters = ['ALL','DRAFT','SENT', 'PENDING', 'APPROVED', 'COMPLETED']

    const filteredData = useMemo(() => {
        let result = data?.customers ?? [];

        if (activeFilter !== 'ALL') {
            result = result.map(cus => ({
                    ...cus,
                    quote: cus.quote.filter(qt => 
                        qt.status === activeFilter.toLowerCase().replace(' ', '_')
                    )
                }))
                .filter(cus => cus.quote.length > 0);
        }

        if (searchFilter.trim() !== '') {
            const search = searchFilter.toLowerCase().trim();
            result = result.filter(cus => 
                cus.first_name?.toLowerCase().includes(search) ||
                cus.last_name?.toLowerCase().includes(search) ||
                cus.quote.some(qt => qt.job_id?.toLowerCase().includes(search))||
                cus.quote.some(qt => 
                    qt.job?.some(job => job.description.toLowerCase().includes(search))
                )
            );
        }

        return result;

    }, [data, activeFilter, searchFilter]);

    function handleSearchChange(e){
        setSearchFilter(e.target.value);
    }


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
                    />
                </div>
            </div>
        </div>
    )
}
