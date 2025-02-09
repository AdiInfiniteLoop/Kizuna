import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "https://kizuna.onrender.com/",
    withCredentials: true
})