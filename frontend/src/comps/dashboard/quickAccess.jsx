import { quickAccessQueries } from "../../hooks/quickAccess.hooks.jsx";
import { useQueries } from "@tanstack/react-query";

export async function QuickAccess(){
    const [ monthlyRevenue, completedJobs, activeJobs, unpaidJobs ] = quickAccessQueries.map(data => data.data)
    const isLoading = quickAccessQueries.some(data => data.isLoading)
    const isError = quickAccessQueries.some(data => data.isError);

    return (
        <div>
            <div>
                <StatCard
                    title = "ACTIVE JOBS"
                    value = {activeJobs}
                    isLoading={isLoading}
                    isError={isError}
                />
                <span></span>
            </div>
            <div>
                <StatCard
                    title = "MONTHLY REVENUE"
                    value = {monthlyRevenue}
                    isLoading={isLoading}
                    isError={isError}
                />
            </div>
            <div>
                <StatCard
                    title = "UNPAID QUOTES"
                    value = {unpaidJobs}
                    isLoading={isLoading}
                    isError={isError}
                />
            </div>
            <div>
               <StatCard
                    title = "COMPLETED JOBS"
                    value = {completedJobs}
                    isLoading={isLoading}
                    isError={isError}
                    subtitle= "THIS MONTH"
                />
            </div>
        </div>
    )
}





function StatCard({ title, value, isLoading, isError, subtitle }) {
  return (
    <div>
      <h3>{title}</h3>
      {isLoading ? (
        <h1>LOADING...</h1>
      ) : isError ? (
        <h1>ERROR</h1>
      ) : (
        <h2>{value ?? 0}</h2>
      )}
      {subtitle && <span>{subtitle}</span>}
    </div>
  );
}
