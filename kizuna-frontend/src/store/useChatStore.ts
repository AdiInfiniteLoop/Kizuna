import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { AxiosError } from "axios";
import { useAuthStore, User } from "./useAuthStore";

export interface MessageInterface {
  _id?: string;
  senderId: string;
  receiverId: string;
  text?: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

interface ChatStoreInterface {
  messages: MessageInterface[];
  users: User[];
  selectedUser: User | null;
  isUsersLoading: boolean;
  isMessageLoading: boolean;
  getUsers: () => void;
  getMessages: (userId: string | undefined) => void;
  setSelecteduser: (selectedUser: User | null) => void;
  sendMessage: (data: { text: string; image: string | null }) => void;
  subscribeToMessages: () => void;
  unsubscribeFromMessages: () => void;
}

export const useChatStore = create<ChatStoreInterface>((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessageLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get('/messages/users');

      set({ users: res.data.data });
    } catch (err: unknown) {
      console.log(err);
      if (err instanceof AxiosError) {
        toast.error(err.response?.data?.message || "Something went wrong");
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessageLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);

      if (!Array.isArray(res.data?.data)) {
        throw new Error("Invalid response format");
      }
      if (res.data.data) {
        set({ messages: res.data.data });
      } else {
        set({ messages: [] });
      }
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data?.message || "Something went wrong");
      } else {
        console.log(err);
      }
    } finally {
      set({ isMessageLoading: false });
    }
  },

  sendMessage: async (data) => {
    const { selectedUser, messages } = get();

    if (!selectedUser) {
      toast.error("No user selected");
      return;
    }

    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, data);

      set({ messages: [...messages, res.data.data] });
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        let msg =  err.response?.data?.message
        if( msg === 'request entity too large') {
            msg = 'Try sending a smaller image please'
        }
        toast.error(msg || "Something went wrong");
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    if (!socket) {
      toast.error("Socket connection not established");
      return;
    }

    socket.on("newMessage", (newMessage: MessageInterface) => {
      const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id ;
      if (!isMessageSentFromSelectedUser) return;

      set({ messages: [...get().messages, newMessage] });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;

    if (!socket) {
      toast.error("Socket connection not established");
      return;
    }

    socket.off("newMessage");
  },

  setSelecteduser: (selectedUser: User | null) => set({ selectedUser, messages: [] })

}));
