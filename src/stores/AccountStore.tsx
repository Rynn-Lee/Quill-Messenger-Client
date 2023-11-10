import { create } from 'zustand'

interface userData {
  userId: string
  username: string
  password: string
}

type AccoutStore = {
  counter: number
  userId: string
  username: string
  password: string
  setUser: (arg0: userData) => void
  counterAdd: () => void
}

export const useAccountStore = create<AccoutStore>()((set) => ({
  counter: 0,
  userId: "",
  username: "",
  password: "",
  setUser: (userdata: userData) => set((state) => ({
    userId: userdata.userId,
    username: userdata.username,
    password: userdata.password
  })),
  counterAdd: () => set((state) => ({counter: state.counter + 1}))
}))