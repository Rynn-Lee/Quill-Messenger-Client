export type userData = {
  avatar: {
    format: string
    code: string
  },
  displayedName: string,
  usertag: string,
  createdAt: string
  _id: string
}

export type chat = {
  _id: string,
  members: string[],
  createdAt: string,
  updatedAt: string,
  inputMessage: string,
  isTyping: boolean,
  lastMessage: string,
}