import { useNotiHook } from "../../hooks/notifications.hooks.jsx";

export function NotiPage(){
    const { data, isLoading, isError, error } = useNotiHook();

    console.log(data)

    return(
        <div className='notiContainer'>

        </div>
    )
}