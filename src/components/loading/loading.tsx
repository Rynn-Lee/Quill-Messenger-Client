import Icon from "@/assets/Icons";
import styles from "./loading.module.sass"

export default function Loading(){
  return(
  <div className={styles.loading}>
    <div className={styles.fading}>
      <span className={styles.loadingIco}><Icon.Loading /></span>
      <span className={styles.loadingText}>Connecting to the server... Please wait</span>
    </div>
  </div>
  )
}