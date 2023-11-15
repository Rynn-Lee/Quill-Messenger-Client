import { login, register } from "@/api"
import { WarningContext } from "@/lib/warning/warning-context"
import Icon from "@assets/Icons"
import Input from "@components/interface/Input"
import { useAccountStore } from "@store/AccountStore"
import styles from "@styles/pages/login.module.sass"
import { useRouter } from "next/router"
import { useContext, useState } from "react"

export default function Home() {
  const router = useRouter()
  const warning: any = useContext(WarningContext)
  const [user, setUser] = useState({
    usertag: "",
    password: ""
  })
  const {username, password, userId}: any = useAccountStore()

  const addNewUser = async() => {
    const result = await register(user)
    if(result.status >= 400){warning.throwError({title: "Failed to Register", message: result.message})}
  }
  const LoginAccount = async() => {
    const result = await login(user)
    if(result.status >= 400){warning.throwError({title: "Failed to Log In", message: result.message})}
  }

  return (
    <div className={styles.loginPage}>
      <span className={styles.title}><Icon.Quill/>Quill Messenger</span>
      <Input
        onChange={(e)=>setUser({...user, usertag: e.target.value})}
        value={user.usertag}
        fancy={{text: "UserTag", placeholder: "User Tag"}}
        type="text"/>
      <Input
        onChange={(e)=>setUser({...user, password: e.target.value})}
        value={user.password}
        fancy={{text: "Password", placeholder: "Password", hide: true}}
        type="password"/>
      <div className={styles.loginButtons}>
        <button className={styles.loginButton} onClick={addNewUser}>New Account</button>
        <button className={styles.loginButton} onClick={LoginAccount}>Login</button>
      </div>
    </div>
  )
}
