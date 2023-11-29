import { create } from 'zustand'

interface userData {
  _id: string,
  usertag: string,
  displayedName: string,
  lastOnline: string,
}

type AccoutStore = {
  _id: string,
  usertag: string,
  displayedName: string,
  lastOnline: string,
  setUser: (arg0: userData) => void
}

export const useAccountStore = create<AccoutStore>()((set) => ({
  _id: "",
  usertag: "",
  displayedName: "",
  lastOnline: "",
  setUser: (userdata: userData) => set(() => ({
    _id: userdata._id,
    usertag: userdata.usertag,
    displayedName: userdata.displayedName,
    lastOnline: userdata.lastOnline,
  }))
}))