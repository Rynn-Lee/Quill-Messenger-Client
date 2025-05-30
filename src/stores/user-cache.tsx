import { fetchUserByIdAPI, fetchUserByTagAPI } from '@/api/user-api'
import { userData } from '@/types/types'
import { decodeImage } from '@/utils/decodeImage'
import { netRequestHandler } from '@/utils/net-request-handler'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface counterStore {
  userCache: {[key: string]: userData}
  addUserCache: (senderID: string) => void
  removeUserCache: () => void
}

export const useUserCache = create<counterStore>()((set) => ({
  userCache: {},
  addUserCache: async (data) => {
    const user = await netRequestHandler(()=>fetchUserByIdAPI(data))
    set((state)=>({userCache: {...state.userCache, [data]: {...user.data, avatar: user?.data?.avatar?.code}}}))
  },
  removeUserCache: () => set({userCache: {}})
}))