import { useQuickAccess} from "../../hooks/quickAccess.hooks.jsx";

export function QuickAccess(){
    const { data, isLoading, isError } = useQuickAccess();
   	
	console.log(data);

    return (
        <div className='statCardsGrid'>
            <div className='statCardWrapper'>
                <StatCard
                    title="ACTIVE JOBS"
                    value={data?.activeJobs?.length ?? 0}
                    isLoading={isLoading}
                    isError={isError}
                    subtitle="THIS MONTH"
                />
            </div>
            <div className='statCardWrapper'>
                <StatCard
                    title="MONTHLY REVENUE"
                    value={`$ ${data?.monthlyTotal ?? 0}`}
                    isLoading={isLoading}
                    isError={isError}
                    subtitle="THIS MONTH"
                />
            </div>
            <div className='statCardWrapper'>
                <StatCard
                    title="UNPAID QUOTES"
                    value={data?.unpaidJobs?.length ?? 0}
                    isLoading={isLoading}
                    isError={isError}
                    subtitle="THIS MONTH"
                />
            </div>
            <div className='statCardWrapper'>
               <StatCard
                    title="COMPLETED JOBS"
                    value={data?.completedJobs?.length ?? 0}
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
