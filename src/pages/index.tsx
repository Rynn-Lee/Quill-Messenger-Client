import { login, register } from "@/api"
import { getItem, setItem } from "@/lib/local-storage"
import { WarningContext } from "@/lib/warning/warning-context"
import Icon from "@assets/Icons"
import Input from "@components/interface/Input"
import { useAccountStore } from "@store/AccountStore"
import styles from "@styles/pages/login.module.sass"
import { useRouter } from "next/router"
import { useContext, useEffect, useState } from "react"

export default function Home() {
  const router = useRouter()
  const warning: any = useContext(WarningContext)
  const {setUser}: any = useAccountStore()
  const [userInputs, setUserInputs] = useState({
    usertag: "",
    password: "",
    confirmPassword: "",
  })

  useEffect(()=>{
    const userdata = getItem('userdata')
    if(!userdata){return}
    passLoginScreen(userdata)
  }, [])

  const passLoginScreen = (userdata: any) => {
    setItem('userdata', userdata)
    setUser(userdata)
    router.push("/chats")
  }

  const RegisterAccount = async() => {
    const result = await register(userInputs)
    if(result.status >= 400){warning.showWindow({title: "Failed to Register", message: result.message}); return;}
    passLoginScreen(result)
  }

  const LoginAccount = async() => {
    const result = await login(userInputs)
    if(result.status >= 400){warning.showWindow({title: "Failed to Log In", message: result.message}); return;}
    passLoginScreen(result)
  }

  return (
    <LoginTabs titles={['Login', 'Register']}>
      <div>
        <Input
          onChange={(e)=>setUserInputs({...userInputs, usertag: e.target.value})}
          value={userInputs.usertag}
          fancy={{text: "User Tag", placeholder: "User Tag"}}
          type="text"/>
        <Input
          onChange={(e)=>setUserInputs({...userInputs, password: e.target.value})}
          value={userInputs.password}
          fancy={{text: "Password", placeholder: "Password", hide: true}}
          type="password"/>
        <button className={styles.loginButton} onClick={LoginAccount}>Login</button>
      </div>
      <div>
        <Input
          onChange={(e)=>setUserInputs({...userInputs, usertag: e.target.value})}
          value={userInputs.usertag}
          fancy={{text: "UserTag", placeholder: "User Tag"}}
          type="text"/>
        <Input
          onChange={(e)=>setUserInputs({...userInputs, password: e.target.value})}
          value={userInputs.password}
          fancy={{text: "Password", placeholder: "Password", hide: true}}
          type="password"/>
        <Input
          onChange={(e)=>setUserInputs({...userInputs, confirmPassword: e.target.value})}
          value={userInputs.confirmPassword}
          fancy={{text: "Confirm password", placeholder: "Confirm password", hide: true}}
          type="password"/>
        <button className={styles.loginButton} onClick={RegisterAccount}>Register</button>
      </div>
    </LoginTabs>
  )
}

function LoginTabs({children, titles}: any){
  const [tab, setTab] = useState(0)
  return(
    <div className={styles.loginPage}>
      <span className={styles.title}><Icon.Quill/>Quill Messenger</span>
      <div className={styles.tabButtons}>
        {titles.map((title: string, index: number) => <span key={title} onClick={()=>setTab(index)} className={index == tab ? styles.activeTab : ""}>{title}</span>)}
      </div>
      <div className={styles.loginContent}>
        {children[tab]}
      </div>
    </div>
  )
}