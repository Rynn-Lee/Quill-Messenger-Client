import axios from "axios"
const api_url = 'http://192.168.2.100:4000/api'
// fetchMessages
const fetchChatMessages = async(chatID: string) => {
  try{
    const result = await axios.get(`${api_url}/message/${chatID}`)
    return({
      data: result.data,
      status: 200,
    })
  } catch(err: any) {
    return({
      data: [],
      title: "Not able to fetch messages",
      message: err.response?.data.message || "The server is possibly offline :<",
      status: err.response?.status || 400,
    })
  }
}

// fetchLatestMessage
const fetchLatestMessageAPI = async(chatID: string) => {
  try{
    const result = await axios.get(`${api_url}/message/findLatest/${chatID}`)
    return({
      data: result.data,
      status: 200,
    })
  } catch(err: any) {
    return({
      data: [],
      title: "Not able to fetch messages",
      message: err.response?.data.message || "The server is possibly offline :<",
      status: err.response?.status || 400,
    })
  }
}

// sendMessage
const sendMessageAPI = async(chatID: string, senderID: string, text: string) => {
  try{
    const result = await axios.post(`${api_url}/message/send`, {chatID, senderID, text})
    return({
      data: result.data,
      status: 200,
    })
  } catch(err: any) {
    return({
      data: [],
      title: "Not able to send a message",
      message: err.response?.data.message || "The server is possibly offline :<",
      status: err.response?.status || 400,
    })
  }
}

export {fetchChatMessages, fetchLatestMessageAPI, sendMessageAPI}