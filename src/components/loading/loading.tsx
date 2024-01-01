import Icon from "@/assets/Icons";
import styles from "./loading.module.sass"

export default function Loading(){

  return(
  <div className={styles.loading}>
    <span className={styles.loadingIco}><Icon.Loading /></span>
    <span className={styles.loadingText}>Trying to log in... Please wait</span>
  </div>
  )
}