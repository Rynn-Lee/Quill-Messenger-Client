import { updateUserProfileAPI } from "@/api/user-api"
import Input from "@/components/interface/Input"
import { setItem } from "@/lib/local-storage"
import { WarningContext, warningHook } from "@/lib/warning/warning-context"
import { useAccountStore } from "@/stores/account-store"
import { netRequestHandler } from "@/utils/net-request-handler"
import { tryCatch } from "@/utils/try-catch"
import styles from "@styles/pages/profile.module.sass"
import Image from "next/image"
import { useContext, useState } from "react"

export default function Profile() {
  const warning = useContext<warningHook>(WarningContext)
  const user = useAccountStore()
  const {setUser} = useAccountStore()
  const [newData, setNewData] = useState({
    avatar: user.avatar,
    displayedName: user.displayedName
  })

  const update = async() => {
    tryCatch(async()=> {
      const result = await netRequestHandler(()=>updateUserProfileAPI({_id: user._id, ...newData}), warning)
      setItem('userdata', result.data)
      setUser(result.data)
    })
  }

  return (
    <div className={styles.profile}>
      <fieldset>
        <legend>Avatar</legend>
        <Image src={user.avatar} alt="profile" width={60} height={60}/>
        <Input 
          value={newData.avatar}
          onChange={(e)=>setNewData({...newData, avatar: e.target.value})}/>
        <button onClick={update}>Change avatar</button>
      </fieldset>
      <fieldset>
        <legend>displayedname</legend>
        <Input 
          value={newData.displayedName}
          onChange={(e)=>setNewData({...newData, displayedName: e.target.value})}/>
        <button onClick={update}>Change displayedName</button>
      </fieldset>
    </div>
  )
}
