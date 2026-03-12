export class AuthService {
    constructor(supabase){
        this.supabase = supabase
    }

    async signUp(email, password, username){
        if(!email || !password || !username){
            throw new Error('Invaild feilds. Please fill feilds')
        }
        const { data, error } = await this.supabase.auth.signUp({
            email,
            password,
            options: [
                username
            ]
        })

        if(error){
            throw new Error(error.message);
        }

        console.log(data)
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

        console.log(data)
        return data;
    }

    async logout(){
        const { error } = await this.supabase.auth.signOut();

        if(error){
            throw new Error(`Failed to Logout user ${error.message}`);
        }

        console.log('Successful logOut')
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
