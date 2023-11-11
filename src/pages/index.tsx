import Icon from "@/assets/Icons"
import Input from "@/components/interface/Input"
import { useAccountStore } from "@store/AccountStore"
import styles from "@styles/pages/login.module.sass"
import { useState } from "react"

export default function Home() {
  const [user, setUser] = useState({
    username: "",
    password: ""
  })
  const {username, password, userId}: any = useAccountStore()

  return (
    <div className={styles.loginPage}>
      <span className={styles.title}><Icon.Quill/>Quill Messenger</span>
      <Input
        onChange={(e)=>setUser({...user, username: e.target.value})}
        value={user.username}
        fancy={{text: "Username", placeholder: "Username"}}
        type="text"/>
      <Input
        onChange={(e)=>setUser({...user, password: e.target.value})}
        value={user.password}
        fancy={{text: "Password", placeholder: "Password", hide: true}}
        type="password"/>
      <div className={styles.loginButtons}>
        <button className={styles.loginButton}>New Account</button>
        <button className={styles.loginButton}>Login</button>
      </div>
    </div>
  )
}
