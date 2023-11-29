import { create } from 'zustand'

export const useStatusStore = create((set) => ({
  connected: "offline",
  setConnection: (data: boolean) => set(() => ({ connected: data })),
}))