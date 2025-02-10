import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';
import io from 'socket.io-client';

export type User = {
  _id?: string | undefined;
  email: string;
  fullName?: string;
  password: string;
  profilePic?: string;
  createdAt?: string;
};

type Store = {
  authUser: null | User;
  isSigningUp: boolean;
  isLogginIn: boolean;
  isUpdatingProfile: boolean;
  isCheckingAuth: boolean;
  pendingUserData: User | null; // Store pending user data during signup
  checkAuth: () => void;
  signup: (data: User) => Promise<void>;
  verifyOTP: (email: string, otp: string) => Promise<void>;
  login: (data: User) => void;
  logout: () => void;
  updateProfile: (data: { profilePic?: string }) => void;
  onlineUsers: string[];
  socket: SocketIOClient.Socket | null;
  connectSocket: () => void;
  disconnectSocket: () => void;
};

const BE_URL = 'https://kizuna.onrender.com/';

export const useAuthStore = create<Store>((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLogginIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,
  pendingUserData: null, // Initialize pending user data

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get('/auth/check');
      set({ authUser: res.data });
      get().connectSocket();
    } catch (err) {
      console.log(err);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      await axiosInstance.post('/auth/signup', data);
      // Store the user data for later use during OTP verification
      set({ pendingUserData: data });
      toast.success('Verification code sent to your email');
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data?.message || 'Something went wrong');
      } else {
        toast.error('An unexpected error occurred');
      }
      throw err;
    } finally {
      set({ isSigningUp: false });
    }
  },

  verifyOTP: async (email: string, otp: string) => {
    const pendingUserData = get().pendingUserData;
    if (!pendingUserData) {
      toast.error('No pending registration found');
      throw new Error('No pending registration found');
    }

    try {
      const res = await axiosInstance.post('/auth/verify-otp', {
        email,
        otp,
        fullName: pendingUserData.fullName,
        password: pendingUserData.password,
      });
      
      set({ 
        authUser: res.data.data,
        pendingUserData: null // Clear pending data after successful verification
      });
      get().connectSocket();
      toast.success('Account verified successfully!');
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data?.message || 'Invalid OTP');
      } else {
        toast.error('An unexpected error occurred');
      }
      throw err;
    }
  },

  // ... rest of the store methods remain the same ...
  login: async (data) => {
    set({ isLogginIn: true });
    try {
      const res = await axiosInstance.post('/auth/login', data);
      set({ authUser: res.data.data });
      toast.success('Logged In Successfully');
      get().connectSocket();
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data?.message || 'Something went wrong');
      } else {
        toast.error('An unexpected error occurred');
      }
    } finally {
      set({ isLogginIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post('/auth/logout');
      set({ authUser: null });
      get().disconnectSocket();
      toast.success('Logged Out Successfully');
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data?.message || 'Something went wrong');
      } else {
        toast.error('An unexpected error occurred');
      }
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put('/auth/update-profile', data);
      set({ authUser: res.data });
      toast.success('Profile Updated Successfully');
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data?.message || 'Something went wrong');
      } else {
        toast.error('An unexpected error occurred');
      }
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;
    
    const socket = io(BE_URL, {
      query: { userId: authUser._id },
    });

    if (!socket) {
      toast.error('Socket connection failed');
      return;
    }

    socket.connect();
    set({ socket: socket });

    socket.on('getOnlineUsers', (users: string[]) => {
      set({ onlineUsers: users });
    });
  },

  disconnectSocket: () => {
    const socket = get().socket;
    if (socket && socket.connected) {
      socket.disconnect();
    } else {
      toast.error('No active socket connection to disconnect');
    }
  },
}));