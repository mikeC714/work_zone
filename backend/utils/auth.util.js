import { getUser } from "./getUser"

export async function isTokenValid(token){
    try{
        await getUser(token)
        return true
    }catch{
        return false
    }
}
