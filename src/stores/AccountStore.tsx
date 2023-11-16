import { create } from 'zustand'

interface userData {
  _id: string,
  usertag: string,
  password: string,
  displayedName: string,
  lastOnline: string,
}

type AccoutStore = {
  _id: string,
  usertag: string,
  password: string,
  displayedName: string,
  lastOnline: string,
  setUser: (arg0: userData) => void
}

export const useAccountStore = create<AccoutStore>()((set) => ({
  _id: "",
  usertag: "",
  password: "",
  displayedName: "",
  lastOnline: "",
  setUser: (userdata: userData) => set((state) => ({
    _id: userdata._id,
    usertag: userdata.usertag,
    password: userdata.password,
    displayedName: userdata.displayedName,
    lastOnline: userdata.lastOnline,
  }))
}))