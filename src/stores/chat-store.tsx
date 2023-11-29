import { create } from 'zustand'

export const useChatStore = create((set) => ({
  userChats: null,
  setUserChats: (data: any) => set((state: any) => ({ userChats: data })),
}))