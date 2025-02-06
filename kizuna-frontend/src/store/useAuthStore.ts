import {create} from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';

type User= {
    id?:string,
    email: string,
    fullName?: string,
    password: string,
    profilePic ?: string,
    createdAt ?: string
}

type Store = {
    authUser: null | User
    isSigningUp: boolean,
    isLogginIn:boolean,
    isUpdatingProfile:boolean,
    isCheckingAuth: boolean,
    checkAuth: () => void,
    signup: (data: User) => void,
    login: (data: User) => void,
    logout: () => void,
    updateProfile: (data: { profilePic?: string }) => void
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
    },

    signup: async(data) => {
        set({isSigningUp: true})
        try {
            const res = await axiosInstance.post('/auth/signup', data)
            set({authUser: res.data})
            console.log("bhadwaaa")
            toast.success('Account Created Successfully');
        }
        catch (err: unknown) {
            if (err instanceof AxiosError) {
              toast.error(err.response?.data?.message || "Something went wrong");
            } else {
              toast.error("An unexpected error occurred");
            }
          }
          
        finally {
            set({isSigningUp: false})
        }
    },

    login: async(data) => {
        set({isLogginIn: true});
        try {
            const res = await axiosInstance.post('auth/login', data);
            set({authUser: res.data});
            toast.success('Logged In Successfully')
        }
        catch (err: unknown) {
            if (err instanceof AxiosError) {
              toast.error(err.response?.data?.message || "Something went wrong");
            } else {
              toast.error("An unexpected error occurred");
            }
          }
          
        finally {
            set({isLogginIn: false})
        }
    },

    logout: async() => {
        try {
            await axiosInstance.post('/auth/logout');
            set({
                authUser: null
            });
            toast.success("Logged Out Successfully")
        }
        catch (err: unknown) {
            if (err instanceof AxiosError) {
              toast.error(err.response?.data?.message || "Something went wrong");
            } else {
              toast.error("An unexpected error occurred");
            }
          }
    },

    updateProfile: async(data) => {
        set({isUpdatingProfile: true})
        try {
            const res = await axiosInstance.put('./auth/update-profile', data);
            set({authUser: res.data})
            toast.success('Profile Updated Successfully')
        }
        catch (err: unknown) {
            if (err instanceof AxiosError) {
              toast.error(err.response?.data?.message || "Something went wrong");
            } else {
              toast.error("An unexpected error occurred");
            }
          }
          
        finally {
            set({isUpdatingProfile: false})
        }
    }
}))