import axios from "axios"
const api_url = 'http://192.168.2.100:4000/api'
// const api_url = 'http://192.168.2.107:4000/api'
// const api_url = 'http://localhost:4000/api'
// const api_url = 'https://quill-messenger-server.onrender.com/api'

//getChats
const fetchUserChatsAPI = async(_id: string) => {
  try{
    const result = await axios.get(`${api_url}/chat/${_id}`)
    const resultgroups = await axios.get(`${api_url}/group/${_id}`)
    return({
      data: [...result.data.chats, ...resultgroups.data.groups],
      status: 200,
    })
  } catch(err: any) {
    return({
      data: [],
      title: "Не удалось получить чаты",
      message: err.response?.data.message || "The server is possibly offline :<",
      status: err.response?.status || 400,
    })
  }
}

//createChat
const createNewChatAPI = async(firstID: string, secondID: string) => {
  try{
    const result = await axios.post(`${api_url}/chat/create`, {firstID, secondID})
    return({
      data: result.data,
      status: 200,
    })
  } catch(err: any) {
    return({
      data: [],
      title: "Не удалось создать чат",
      message: err.response?.data.message || "The server is possibly offline :<",
      status: err.response?.status || 400,
    })
  }
}

const deleteChatAPI = async(chatID: string) => {
  try{
    const result = await axios.get(`${api_url}/chat/delete/${chatID}`)
    return({
      data: result.data,
      status: 200,
    })
  } catch(err: any) {
    return({
      data: [],
      title: "Не удалось удалить чат",
      message: err.response?.data.message || "The server is possibly offline :<",
      status: err.response?.status || 400,
    })
  }
}

export {fetchUserChatsAPI, createNewChatAPI, deleteChatAPI}