import Icon from "@/assets/Icons";
import styles from "./loading.module.sass"
import { useEffect, useState } from "react";
import { useLoadingStore } from "@/stores/loading-store";

const phrases = [
  "Actively loading stuff...",
  "Preparing stuff for you...",
  "Poking the server for some data...",
  "Waking up the developer..."
]

export default function Loading(){
  const {setLoading} = useLoadingStore()
  const [randomPhrase, setRandomPhrase] = useState("")
  useEffect(()=>{
    setRandomPhrase(phrases[Math.floor(Math.random() * phrases.length)])
  }, [])

  return(
  <div className={styles.loading}>
    <span className={styles.loadingIco}><Icon.Loading /></span>
    <span className={styles.loadingText}>{randomPhrase}</span>
    <button onClick={()=>setLoading(false)}>Clicky-click</button>
  </div>
  )
}