import {create} from 'zustand';
import { axiosInstance } from '../lib/axios';


type Store = {
    authUser: null | User
    isSigningUp: boolean,
    isLogginIn:boolean,
    isUpdatingProfile:boolean,
    isCheckingAuth: boolean,
    checkAuth: () => void
}


type User= {
    id:string,
    email: string,
    fullName: string,
    password: string,
    profilePic ?: string,
}


export const useAuthStore = create<Store>((set) => ({
    authUser: null ,
    isSigningUp: false,
    isLogginIn:false,
    isUpdatingProfile:false,
    isCheckingAuth: true,

    checkAuth: async() => {
        try {
            const res = await axiosInstance.get('/auth/check');
            set({authUser: res.data})
        }
        catch(err) {
            console.log(err)
            set({authUser: null})
        }
        finally {
            set({isCheckingAuth: false})
        }
    }
}))