import axios from "axios";
import { Message, User } from "../interfaces/interfaces";

const config = {
  withCredentials: true,
  headers: {
    Authorization: "Bearer " + localStorage.getItem("token"),
  },
};

const url = "https://traveling.dev";

let api = {
  users: {
    getAllUsers: () => axios.get<User[]>(`${url}/api/users/allusers`, config),
    registerUser: (data: any) => axios.post(`${url}/api/users/signup`, data),
    loginUser: (data: any) => axios.post(`${url}/api/users/signin`, data),
    getUserById: (id: string) =>
      axios.get<User>(`${url}/api/users/user/${id}`, config),
    signOut: () => axios.post(`${url}/api/users/signout`, config),
  },
  memories: {
    getAllMemories: () => axios.get(`${url}/api/memories/list`, config),
    getMyMemories: () => axios.get(`${url}/api/memories/currentuser`, config),
    getMemoriesForUser: (id: string) =>
      axios.get(`${url}/api/memories/user/${id}`, config),
    createNewMemory: (data: any) =>
      axios.post(`${url}/api/memories/newMemory`, data, config),
    getMemoryById: (id: string) =>
      axios.get(`${url}/api/memories/memory/${id}`, config),
  },
  chat: {
    getChatMessages: (id: string) =>
      axios.get<Message[]>(`${url}/api/chat/${id}`, config),
    sendMessage: (id: string, message: any) =>
      axios.post<Message[]>(`${url}/api/chat/message/${id}`, message, config),
    allMessages: () => axios.get<any>(`${url}/api/chat/messages`, config),
  },
};

export default api;
