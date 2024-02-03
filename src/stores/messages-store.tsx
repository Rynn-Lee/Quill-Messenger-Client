import { create } from 'zustand'

export type message = {
  _id: string,
  chatID: string,
  senderID: string,
  text: string,
  createdAt: string,
  updatedAt: string,
}

export type messageHistory = {
  [key: string]: {
    messages: [message],
    isTyping: boolean,
    inputMessage: string
  }
}

interface messageStore {
  messagesHistory: messageHistory,
  addMessage: (data: message) => void,
  setChatHistory: (data: {chatID: string, messages: message[]}) => void,
}

export const useMessageStore = create<messageStore>()((set) => ({
  messagesHistory: {},
  setChatHistory: (data) => set((state: any) => ({
    messagesHistory: {...state.messagesHistory, [data.chatID]: {
      ...state.messagesHistory[data.chatID],
      'messages': [...data.messages]
    }}
  })),
  addMessage: (data) => set((state: any) => ({
    messagesHistory: {...state.messagesHistory, [data.chatID]: {
      ...state.messagesHistory[data.chatID], messages: [...(state.messagesHistory[data.chatID].messages || []), data]
    }}
  }))
}))