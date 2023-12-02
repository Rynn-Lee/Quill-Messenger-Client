import axios from "axios"

const api_url = 'http://127.0.0.1:4000/api'

const getChats = async(_id: string) => {
  try{
    const result = await axios.get(`${api_url}/chat/${_id}`)
    return({
      data: result.data,
      status: 200,
    })
  } catch(err: any) {
    return({
      data: [],
      message: err.response.data.message,
      status: err.response.status,
    })
  }
}

const createChat = async(firstID: string, secondID: string) => {
  try{
    const result = await axios.post(`${api_url}/chat/create`, {firstID, secondID})
    return({
      data: result.data,
      status: 200,
    })
  } catch(err: any) {
    return({
      data: [],
      message: err.response.data.message,
      status: err.response.status,
    })
  }
}

export {getChats, createChat}