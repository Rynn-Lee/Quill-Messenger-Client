import { userData } from "@/types/types"
import { removeItem } from "@lib/local-storage"
import axios from "axios"

const api_url = 'http://192.168.2.100:4000/api'
// const api_url = 'http://192.168.2.107:4000/api'
// const api_url = 'http://localhost:4000/api'
// const api_url = 'https://quill-messenger-server.onrender.com/api'

const loginAPI = async(userdata: {usertag: string, password: string}) => {
  const url = `${api_url}/user/login`
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
      title: `Couldn't log into account`,
      message: err.response?.data.message || "The server is possibly offline :<",
      status: err.response?.status || 400,
    })
  }
}

const registerAPI = async(userdata: {usertag: string, password: string, confirmPassword: string}) => {
  const url = `${api_url}/user/register`
  if(userdata.password !== userdata.confirmPassword){
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
      title: `Couldn't register a new account`,
      message: err.response?.data.message || "The server is possibly offline :<",
      status: err.response?.status || 400,
    })
  }
}

const fetchAllUsersAPI = async() => {
  try{
    const result = await axios.get(`${api_url}/user/getall`)
    return({
      data: result.data,
      status: 200
    })
  } catch (err: any) {
    return({
      data: null,
      title: `Couldn't fetch users list`,
      message: err.response?.data.message || "The server is possibly offline :<",
      status: err.response?.status || 400,
    })
  }
}

const fetchUserByIdAPI = async(_id: string) => {
  try{
    const result = await axios.get(`${api_url}/user/find/${_id}`)
    return({
      data: result.data,
      status: 200
    })
  } catch (err: any) {
    return({
      data: null,
      title: `No users found with such id`,
      message: err.response?.data.message || "The server is possibly offline :<",
      status: err.response?.status || 400,
    })
  }
}

const fetchUserByTagAPI = async(usertag: string) => {
  try{
    const result = await axios.get(`${api_url}/user/findtag/${usertag}`)
    return({
      data: result.data,
      status: 200
    })
  } catch (err: any) {
    return({
      data: null,
      title: `No users found with such tag`,
      message: err.response?.data.message || "The server is possibly offline :<",
      status: err.response?.status || 400,
    })
  }
}

const updateUserProfileAPI = async(data: {_id: any, avatar?: {format?: any, code?: any}, displayedName?: any} | any) => {
  try{
    const result = await axios.post(`${api_url}/user/update`, {...data})
    return({
      data: result.data,
      status: 200
    })
  } catch (err: any) {
    return({
      data: null,
      title: `Not able to update profile`,
      message: err.response?.data.message || "The server is possibly offline :<",
      status: err.response?.status || 400,
    })
  }
}

const deleteAccount = async(userID: string) => {
  try{
    const result = await axios.get(`${api_url}/user/delete/${userID}`)
    return({
      data: result.data,
      status: 200
    })
  } catch (err: any) {
    return({
      data: null,
      title: `Not able to delete account`,
      message: err.response?.data.message || "The server is possibly offline :<",
      status: err.response?.status || 400,
    })
  }
}

const fetchRandomUserAPI = async(userid: string) => {
  try{
    console.log(userid)
    const result = await axios.get(`${api_url}/user/randomuser?userId=${userid}`)
    return({
      data: result.data,
      status: 200
    })
  } catch (err: any) {
    return({
      data: null,
      title: `Not able to fetch random user`,
      message: err.response?.data.message || "The server is possibly offline :<",
      status: err.response?.status || 400,
    })
  }
}

const changePasswordAPI = async(data: {userId: string, oldPassword: string, newPassword: string}) => {
  const url = `${api_url}/user/changePassword`
  try{
    const result = await axios.post(url, data)
    return({
      data: result.data,
      status: 200
    })
  } catch (err: any) {
    return({
      data: null,
      title: `Not able to change password`,
      message: err.response?.data.message || "The server is possibly offline :<",
      status: err.response?.status || 400,
    })
  }
}

const logoutAPI = async() => {
  try{
    removeItem('userdata')
  } catch (err) { 
    console.log("error")
  }
}

export {loginAPI ,registerAPI, logoutAPI, fetchAllUsersAPI, fetchUserByIdAPI, fetchUserByTagAPI, updateUserProfileAPI, deleteAccount, fetchRandomUserAPI, changePasswordAPI}