import { updateProfile } from "@/api/user-api"
import Input from "@/components/interface/Input"
import { setItem } from "@/lib/local-storage"
import { WarningContext } from "@/lib/warning/warning-context"
import { useAccountStore } from "@/stores/account-store"
import styles from "@styles/pages/profile.module.sass"
import Image from "next/image"
import { useContext, useState } from "react"

export default function Profile() {
  const warning: any = useContext(WarningContext)
  const user = useAccountStore()
  const {setUser} = useAccountStore()
  const [newData, setNewData] = useState({
    avatar: user.avatar,
    displayedName: user.displayedName
  })

  const update = async() => {
    const result = await updateProfile({_id: user._id, ...newData})
    if(result.status >= 400){
      warning.showWindow({title: "Couldn't update", message: `Something went wrong!: ${result.message}`});
      return
    }
    setItem('userdata', result.data)
    setUser(result.data)
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
