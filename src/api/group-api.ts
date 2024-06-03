import axios from "axios"
const api_url = 'http://192.168.2.100:4000/api'

//create group
const createNewGroupAPI = async(name: string, image: string, usersID: string[]) => {
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