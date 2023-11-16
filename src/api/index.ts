import { removeItem } from "@/lib/local-storage"
import { md5hash } from "@lib/encryptor"
import axios from "axios"

const register = async(userdata: any) => {
  try{
    const result = await axios.post(`http://127.0.0.1:4000/newUser`, {
      usertag: userdata.usertag,
      password: md5hash(userdata.password)
    })
    return result.data.message
  } catch(err: any) {
    return {message: err.response.data.message.message, status: err.response.status}
  }
}

const login = async(userdata: any) => {
  try{
  const result = await axios.get(`http://127.0.0.1:4000/login`, 
    {params:{
      usertag: userdata.usertag,
      password: md5hash(userdata.password)
    }})
    return result.data.message
  } catch(err: any) {
    return {message: err.response.data.message.message, status: err.response.status}
  }
}

const logout = async() => {
  try{
    removeItem('userdata')
  } catch (err) { 
    console.log("error")
  }
}


export {register, login, logout}