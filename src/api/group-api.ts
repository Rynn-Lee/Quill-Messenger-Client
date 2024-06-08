import axios from "axios"
const api_url = 'http://192.168.2.100:4000/api'
// const api_url = 'http://192.168.2.107:4000/api'
// const api_url = 'http://localhost:4000/api'
// const api_url = 'https://quill-messenger-server.onrender.com/api'

//create group
const createNewGroupAPI = async(name: string, image: {format: string, code: string}, usersID: string[]) => {
  try{
    const result = await axios.post(`${api_url}/group/create`, {name, image, usersID})
    return({
      data: result.data,
      status: 200,
    })
  } catch(err: any) {
    return({
      data: [],
      title: "Not able to create a new chat",
      message: err.response?.data.message || "The server is possibly offline :<",
      status: err.response?.status || 400,
    })
  }
}

export { createNewGroupAPI }