import { create } from 'zustand'

type messageType = {text: string} | { format: string; code: string | undefined; text: string; } | { format: string; code: string | undefined; }

export type message = {
  _id: string,
  chatID: string,
  senderID: string,
  type: 'media-text'|'media'|'text',
  text: messageType
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
  removeMessage: (data: message) => void,
  setChatHistory: (data: {chatID: string, messages: message[]}) => void,
  clearMessageStore: () => void
}

export const useMessageStore = create<messageStore>()((set) => ({
  messagesHistory: {},
  setChatHistory: (data) => set((state: any) => ({
    messagesHistory: {...state.messagesHistory, [data.chatID]: {
      ...state.messagesHistory[data.chatID],
      'messages': [...data.messages]
    }}
  })),
  removeMessage: (data) => set((state: any) => ({
    messagesHistory: {...state.messagesHistory, [data?.chatID]: {
      ...state?.messagesHistory[data.chatID], messages: state?.messagesHistory[data?.chatID]?.messages.filter((message: message) => message._id != data._id)
    }}
  })),
  addMessage: (data) => set((state: any) => ({
    messagesHistory: {...state.messagesHistory, [data?.chatID]: {
      ...state?.messagesHistory[data.chatID], messages: [...(state?.messagesHistory[data?.chatID]?.messages ?? []), data]
    }}
  })),
  clearMessageStore: () => set(()=>({messagesHistory: {}}))
}))