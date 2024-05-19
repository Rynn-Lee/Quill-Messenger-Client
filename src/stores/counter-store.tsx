import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type counter = {
  chatID: string
  counter: number
}

interface counterStore {
  counters: {[key: string]: counter}
  addCounter: (data: {chatID: string}) => void
  resetCounter: (data: {chatID: string}) => void
}

export const useCounterStore = create<counterStore>()(persist((set) => ({
  counters: {},
  addCounter: (data: {chatID: string}) => set((state) => ({
    counters: {...state.counters, [data.chatID]: {chatID: data.chatID, counter: state?.counters[data.chatID]?.counter + 1}}
  })),
  resetCounter: (data: {chatID: string}) => set((state) => ({
    counters: {...state.counters, [data.chatID]: {chatID: data.chatID, counter: 0}}
  }))
}),{
  name: "message-counters"
}))