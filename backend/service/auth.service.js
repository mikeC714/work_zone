export class AuthService {
    constructor(supabase){
        this.supabase = supabase
    }

    async signUp(firstName, lastName, email, password){
        if(!email || !password || !firstName || !lastName){
            throw new Error('Invaild feilds. Please fill feilds')
        }
        const { data, error } = await this.supabase.auth.signUp({
            email,
            password,
            options: {
                data:{
                    first_name: firstName,
                    last_name: lastName
                }
            }
        })

        if(error){
            throw new Error(error.message);
        }
        return data;
    }

    async login(email, password){
        if(!email || !password){
            throw new Error('Invaild User. Please try again')
        }

        const { data, error } = await this.supabase.auth.signInWithPassword({
            email,
            password
        })
         
        if(error){
            throw new Error(`Failed to login user: ${error.message}`);
        }
        return data;
    }

    async logout(){
        const { error } = await this.supabase.auth.signOut();

        if(error){
            throw new Error(`Failed to Logout user ${error.message}`);
        }

        console.log('Successful logOut')
    }

    async deleteUser(pass, user){

        const { error: deleteError } = await this.supabase.auth.admin.deleteUser(user.id)
        if(deleteError){
            throw new Error(`Failed to Delete User ${user.id}`)
        }
        console.log(`Successfully Deleted User ${user.id}`)
    }

    async existingUser(email){
        const { data } = await this.supabase
            .from('users')
            .select('email')
            .eq('email', email)
            .maybeSingle()
        
        return !!data
    }
}



