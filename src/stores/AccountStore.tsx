import { create } from 'zustand'

interface userData {
  userId: string
  username: string
  password: string
}

type AccoutStore = {
  userId: string
  username: string
  password: string
  setUser: (arg0: userData) => void
}

export const useAccountStore = create<AccoutStore>()((set) => ({
  userId: "",
  username: "",
  password: "",
  setUser: (userdata: userData) => set((state) => ({
    userId: userdata.userId,
    username: userdata.username,
    password: userdata.password
  }))
}))