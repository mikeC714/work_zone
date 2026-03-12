import { AuthService } from "../service/auth.service.js";

const fakeLogin = {
    auth: {
        signInWithPassword: () => ({ 
            data: {email: 'FakeEmail@email.com', password: 'zxcvbnm'},
            error: null
        })
    }
}

const fakeSignOut = {
    auth: {
        signOut: () => ({
            error: null
        })
    }
}

const fakeSignup = {
    auth:{
        signUp: () => ({
            data: ({email: 'fakeEamil@email.com', password: 'abc123',
                options: [
                    'joeMama'
                ]
            })
        })
    }
}


const testLogin = new AuthService(fakeLogin)
const testSignup = new AuthService(fakeSignup)


console.log(testLogin.login('FakeEmail@email.com', 'zxcvbnm'));
console.log(testSignup.signUp('fakeEamil@email.com', 'abc123', ['joeMama']))


