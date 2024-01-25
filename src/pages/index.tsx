import { loginAPI, registerAPI } from "@/api/user-api"
import { getItem, setItem } from "@/lib/local-storage"
import { WarningContext, warningHook } from "@/lib/warning/warning-context"
import Icon from "@assets/Icons"
import Input from "@components/interface/Input"
import { useAccountStore } from "@/stores/account-store"
import styles from "@styles/pages/login.module.sass"
import { useRouter } from "next/router"
import { useContext, useEffect, useState } from "react"
import { inputFilter } from "@/utils/input-filter"
import { netRequestHandler } from "@/utils/net-request-handler"
import { tryCatch } from "@/utils/try-catch"
import { userData } from "@/types/types"

export default function Home() {
  const router = useRouter()
  const warning = useContext<warningHook>(WarningContext)
  const accountStore = useAccountStore()
  const [toggle, setToggle] = useState<boolean>(false)
  const [userInputs, setUserInputs] = useState({
    usertag: "",
    password: "",
    confirmPassword: "",
  })

  const passLoginScreen = (userdata?: userData) => {
    userdata && accountStore.setUser(userdata)
    router.push("/chat")
  }

  useEffect(()=>{
    if(!accountStore._id){ return }
    passLoginScreen()
  }, [])

  const registerNewAccount = async() => {
    tryCatch(async()=>{
      const result = await netRequestHandler(()=>registerAPI(userInputs), warning)
      passLoginScreen(result.data)
    })
  }

  const loginAccount = async() => {
    tryCatch(async()=>{
      const result = await netRequestHandler(()=>loginAPI(userInputs), warning)
      passLoginScreen(result.data)
    })
  }

  return(
    <div className={styles.loginPage}>
      <div className={styles.inputsDiv}>
        <Input
          onChange={(e)=>setUserInputs({...userInputs, usertag: inputFilter(e.target.value)})}
          value={userInputs.usertag.toLocaleLowerCase()}
          fancy={{text: "Usertag", placeholder: "Usertag", backgroundHover: "var(--loginInputHover)", background: "var(--loginInput)"}}
          type="text"/>
        <Input
          onChange={(e)=>setUserInputs({...userInputs, password: e.target.value})}
          value={userInputs.password}
          fancy={{text: "Password", placeholder: "Password", backgroundHover: "var(--loginInputHover)", background: "var(--loginInput)", hide: true}}
          type="password"/>
        {toggle ?<Input
          onChange={(e)=>setUserInputs({...userInputs, confirmPassword: e.target.value})}
          value={userInputs.confirmPassword}
          fancy={{text: "Confirm Password", placeholder: "Confirm Password", backgroundHover: "var(--loginInputHover)", background: "var(--loginInput)", hide: true}}
          type="password"/> : <></>}
        {!toggle
        ? <button className={styles.loginButton} onClick={loginAccount} disabled={
          !userInputs.usertag ||
          !userInputs.password.length}>Login</button>
        : <button className={styles.loginButton} onClick={registerNewAccount} disabled={
          (userInputs.usertag.length < 3) ||
          (userInputs.usertag.length > 30) ||
          (userInputs.password.length < 8) || 
          (userInputs.password !== userInputs.confirmPassword)}>Register</button>}
        
        <span className={styles.toggleText} onClick={()=>setToggle(!toggle)}>{!toggle ? "I don't have an account!" : "I have an account!"}</span>
      </div>

      <div className={styles.description}>
        <h2 className={styles.title}><Icon.Quill/> Quill Messenger</h2>
        <h3>Welcome, User!</h3>
        We're glad to see you here!<br/>
        Log In or create a new account! Other people are waiting for you!
      </div>
    </div>
  )
}
