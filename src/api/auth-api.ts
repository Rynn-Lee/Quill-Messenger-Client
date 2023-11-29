import { removeItem } from "@lib/local-storage"
import axios from "axios"

const api_url = 'http://127.0.0.1:4000/api'

const account = async(userdata: any, register: boolean) => {
  const url = register ? `${api_url}/user/register` : `${api_url}/user/login`
  if(register && userdata.password !== userdata.confirmPassword){
    return {message: "Passwords do not match!", status: 400};
  }
  try{
    const result = await axios.post(url, {
      usertag: userdata.usertag,
      password: userdata.password
    })
    return({
      data: result.data,
      status: 200,
    })
  } catch(err: any) {
    return({
      data: null,
      message: err.response.data.message,
      status: err.response.status,
    })
  }
}

const getUsers = async() => {
  try{
    const result = await axios.get(`${api_url}/user/getall`)
    return({
      data: result.data,
      status: 200
    })
  } catch (err: any) {
    return({
      data: null,
      message: err.response.data.message,
      status: err.response.status,
    })
  }
}


const logout = async() => {
  try{
    removeItem('userdata')
  } catch (err) { 
    console.log("error")
  }
}


export {account, logout, getUsers}