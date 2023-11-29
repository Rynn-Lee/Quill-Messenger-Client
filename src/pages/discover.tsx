import { getUsers } from "@/api/auth-api"
import { useAccountStore } from "@/stores/account-store"
import { useEffect, useState } from "react"

export default function Discover() {
  const [users, setUsers] = useState<any>()
  const {usertag}: any = useAccountStore()

  const parseUsers = async() => {
    const result = await getUsers()
    setUsers(result.data)
    console.log("result.data", result.data)
  }

  useEffect(()=>{parseUsers()}, [])

  return (
    <>
      Discover
      {users?.map((item: any)=> item.usertag != usertag && (
        <span key={item.usertag}>{item.usertag}</span>
      ))}
    </>
  )
}
