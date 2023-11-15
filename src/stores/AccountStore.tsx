import { getItem } from '@/lib/local-storage'
import { create } from 'zustand'

interface userData {
  userId: string
  username: string
  password: string
}

type AccoutStore = {
  userId: string
  usertag: string
  displayedName?: string
  password: string
  setUser: (arg0: userData) => void
}

export const useAccountStore = create<AccoutStore>()((set) => ({
  userId: "",
  usertag: "",
  displayedName: "",
  password: "",
  setUser: (userdata: userData) => set((state) => ({
    userId: userdata.userId,
    username: userdata.username,
    password: userdata.password
  }))
}))