import { getUser } from "../utils/getUser.js"

export async function isTokenValid(token){
    try{
        await getUser(token)
        return true
    }catch{
        return false
    }
}
