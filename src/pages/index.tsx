import { account } from "@/api/auth-api"
import { getItem, setItem } from "@/lib/local-storage"
import { WarningContext } from "@/lib/warning/warning-context"
import Icon from "@assets/Icons"
import Input from "@components/interface/Input"
import { useAccountStore } from "@/stores/account-store"
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


  const inputFilter = (value: string, key: string) => {
    const filteredValue = value.replace(/[\u0400-\u04FF\s!@#$%^&*()-+=?:;№"']/g, "").toLocaleLowerCase()
    setUserInputs({...userInputs, [key]: filteredValue})
  }

  const passLoginScreen = (userdata: any) => {
    setItem('userdata', userdata)
    setUser(userdata)
    router.push("/chat")
  }

  const accountAction = async(action: boolean) => {
    const result = await account(userInputs, action)
    if(result.status >= 400){
      warning.showWindow({title: "Failed to Perform an action", message: result.message});
      return;
    }
    passLoginScreen(result.data)
  }

  return (
    <LoginTabs titles={['Login', 'Register']}>
      <div>
        <Input
          onChange={(e)=>inputFilter(e.target.value, 'usertag')}
          value={userInputs.usertag.toLocaleLowerCase()}
          fancy={{text: "UserTag", placeholder: "User Tag"}}
          type="text"/>
        <Input
          onChange={(e)=>setUserInputs({...userInputs, password: e.target.value})}
          value={userInputs.password}
          fancy={{text: "Password", placeholder: "Password", hide: true}}
          type="password"/>
        <button className={styles.loginButton} onClick={()=>accountAction(false)} disabled={
          !userInputs.usertag ||
          !userInputs.password.length}>Login</button>
        
      </div>
      <div>
        <Input
          onChange={(e)=>inputFilter(e.target.value, 'usertag')}
          value={userInputs.usertag.toLocaleLowerCase()}
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
        <button className={styles.loginButton} onClick={()=>accountAction(true)} disabled={
          (userInputs.usertag.length < 3) ||
          (userInputs.usertag.length > 30) ||
          (userInputs.password.length < 8) || 
          (userInputs.password !== userInputs.confirmPassword)}>Register</button>
        
        <ul className={styles.warningLabels}>
          {userInputs.usertag.length < 3 ? <li>Usertag must be longer than 3 characters!</li> : <></>}
          {userInputs.usertag.length > 30 ? <li>Usertag must be no more than 30 characters long!</li> : <></>}
          {userInputs.password.length < 8 ? <li>Password must be longer than 8 characters!</li> : <></>}
          {userInputs.password !== userInputs.confirmPassword ? <li>Passwords do not match!</li> : <></>}
        </ul>
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