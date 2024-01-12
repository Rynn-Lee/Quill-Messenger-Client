import { loginAPI, registerAPI } from "@/api/user-api"
import { getItem, setItem } from "@/lib/local-storage"
import { WarningContext } from "@/lib/warning/warning-context"
import Icon from "@assets/Icons"
import Input from "@components/interface/Input"
import { useAccountStore } from "@/stores/account-store"
import styles from "@styles/pages/login.module.sass"
import { useRouter } from "next/router"
import { useContext, useEffect, useState } from "react"
import { inputFilter } from "@/utils/input-filter"
import { netRequestHandler } from "@/utils/net-request-handler"
import { tryCatch } from "@/utils/try-catch"

export default function Home() {
  const router = useRouter()
  const warning: any = useContext(WarningContext)
  const {setUser}: any = useAccountStore()
  const [userInputs, setUserInputs] = useState({
    usertag: "",
    password: "",
    confirmPassword: "",
  })

  const passLoginScreen = (userdata: any) => {
    setItem('userdata', userdata)
    setUser(userdata)
    router.push("/chat")
  }

  useEffect(()=>{
    const userdata = getItem('userdata')
    if(!userdata){ return }
    passLoginScreen(userdata)
  }, [])

  const registerNewAccount = async() => {
    tryCatch(async()=>{
      const result = await netRequestHandler(registerAPI(userInputs), warning)
      passLoginScreen(result.data)
    })
  }

  const loginAccount = async() => {
    tryCatch(async()=>{
      const result = await netRequestHandler(loginAPI(userInputs), warning)
      passLoginScreen(result.data)
    })
  }

  return (
    <LoginTabs titles={['Login', 'Register']} userInputs={userInputs}>
      <div>
        <Input
          onChange={(e)=>setUserInputs({...userInputs, usertag: inputFilter(e.target.value)})}
          value={userInputs.usertag.toLocaleLowerCase()}
          fancy={{text: "UserTag", placeholder: "User Tag", backgroundHover: "#9385ca50"}}
          type="text"/>
        <Input
          onChange={(e)=>setUserInputs({...userInputs, password: e.target.value})}
          value={userInputs.password}
          fancy={{text: "Password", placeholder: "Password", hide: true, backgroundHover: "#9385ca50"}}
          type="password"/>
        <button className={styles.loginButton} onClick={loginAccount} disabled={
          !userInputs.usertag ||
          !userInputs.password.length}>Login</button>
        
      </div>
      <div>
        <Input
          onChange={(e)=>setUserInputs({...userInputs, usertag: inputFilter(e.target.value)})}
          value={userInputs.usertag.toLocaleLowerCase()}
          fancy={{text: "UserTag", placeholder: "User Tag", backgroundHover: "#9385ca50"}}
          type="text"/>
        <Input
          onChange={(e)=>setUserInputs({...userInputs, password: e.target.value})}
          value={userInputs.password}
          fancy={{text: "Password", placeholder: "Password", hide: true, backgroundHover: "#9385ca50"}}
          type="password"/>
        <Input
          onChange={(e)=>setUserInputs({...userInputs, confirmPassword: e.target.value})}
          value={userInputs.confirmPassword}
          fancy={{text: "Confirm password", placeholder: "Confirm password", hide: true, backgroundHover: "#9385ca50"}}
          type="password"/>
        <button className={styles.loginButton} onClick={registerNewAccount} disabled={
          (userInputs.usertag.length < 3) ||
          (userInputs.usertag.length > 30) ||
          (userInputs.password.length < 8) || 
          (userInputs.password !== userInputs.confirmPassword)}>Register</button>
        
      </div>
    </LoginTabs>
  )
}

function LoginTabs({children, titles, userInputs}: any){
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
      {tab == 1 ? <>
      <ul className={styles.warningLabels}>
        {userInputs.usertag.length < 3 ? <li>Usertag must be longer than 3 characters!</li> : <></>}
        {userInputs.usertag.length > 30 ? <li>Usertag must be no more than 30 characters long!</li> : <></>}
        {userInputs.password.length < 8 ? <li>Password must be longer than 8 characters!</li> : <></>}
        {userInputs.password !== userInputs.confirmPassword ? <li>Passwords do not match!</li> : <></>}
      </ul></> : <></>}
    </div>
  )
}