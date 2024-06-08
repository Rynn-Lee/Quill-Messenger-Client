import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type userData = {
  _id: string,
  usertag: string,
  avatar: string,
  displayedName: string,
}

interface AccoutStore {
  _id: string,
  usertag: string,
  avatar: string,
  displayedName: string,
  setUser: (data: any) => void,
  clearAccountStore: () => void
}

export const useAccountStore = create<AccoutStore>()(persist((set) => ({
  _id: "",
  avatar: "",
  usertag: "",
  displayedName: "",
  setUser: (userdata: userData) => set(() => ({
    _id: userdata._id,
    usertag: userdata.usertag,
    avatar: userdata.avatar,
    displayedName: userdata.displayedName,
  })),
  clearAccountStore: () => set(()=>({
    _id: "",
    usertag: "",
    avatar: "",
    displayedName: "",
  }))
}),{
  name: "userAccount"
}))