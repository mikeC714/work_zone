import { quickAccessQueries } from "../../hooks/quickAccess.hooks.jsx";
import { useQueries } from "@tanstack/react-query";

export function QuickAccess(){
    const quickAccessData = useQueries({ queries: quickAccessQueries })
    const [ monthlyRevenue, completedJobs, activeJobs, unpaidJobs ] = quickAccessData.map(data => data.data);
    const isLoading = quickAccessData.some(data => data.isLoading)
    const isError = quickAccessData.some(data => data.isError);

    return (
        <div className='statCardsGrid'>
            <div className='statCardWrapper'>
                <StatCard
                    title="ACTIVE JOBS"
                    value={activeJobs}
                    isLoading={isLoading}
                    isError={isError}
                     subtitle="THIS MONTH"
                />
                <span></span>
            </div>
            <div className='statCardWrapper'>
                <StatCard
                    title="MONTHLY REVENUE"
                    value={`$ ${monthlyRevenue}`}
                    isLoading={isLoading}
                    isError={isError}
                     subtitle="THIS MONTH"
                />
            </div>
            <div className='statCardWrapper'>
                <StatCard
                    title="UNPAID QUOTES"
                    value={unpaidJobs}
                    isLoading={isLoading}
                    isError={isError}
                     subtitle="THIS MONTH"
                />
            </div>
            <div className='statCardWrapper'>
               <StatCard
                    title="COMPLETED JOBS"
                    value={completedJobs}
                    isLoading={isLoading}
                    isError={isError}
                    subtitle="THIS MONTH"
                />
            </div>
        </div>
    )
}


function StatCard({ title, value, isLoading, isError, subtitle }) {
  return (
    <div className='statCard'>
      <h3 className='statCardTitle'>{title}</h3>
      {isLoading ? (
        <p className='statCardValue'>—</p>
      ) : isError ? (
        <p className='statCardValue'>—</p>
      ) : (
        <p className='statCardValue'>{value ?? 0}</p>
      )}
      {subtitle && <span className='statCardSubtitle'>{subtitle}</span>}
    </div>
  );
}
