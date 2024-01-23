import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type chat = {
  [key: string]: {
    _id: string,
    members: string[],
    createdAt: string,
    updatedAt: string,
    isTyping: boolean,
    lastMessage: number,
  }
}

export type friend = {
  avatar: string,
  displayedName: string,
  usertag: string,
  _id: string
}

interface chatStore {
  userChats: chat,
  activeChat: {chat: chat, friend: friend},
  setUserChats: (data: chat[]) => void,
  addNewChat: (data: {chatID: string, chat: chat}) => void,
  setActiveChat: (data: {chat: chat, friend: friend}) => void
  clearChatStore: () => void,
}

export const useChatStore2 = create<chatStore>()(persist((set) => ({
  userChats: {},
  activeChat: {},
  setUserChats: (data) => set(() => ({ userChats: data })),
  addNewChat: (data) => set((state: any) => ({...state.userChats, [data.chatID]: {
    ...state.userChats[data.chatID],
    ...data.chat,
    isTyping: false,
    lastMessage: 0
  }})),
  setActiveChat: (data) => set(() => ({activeChat: data})),
  clearChatStore: () => set(()=>({userChats: {}}))
}),{
  name: "lastActiveChat"
}))