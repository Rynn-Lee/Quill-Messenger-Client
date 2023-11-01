import Icon from "@/assets/Icons"
import styles from "./top-block.module.sass"

export default function TopBlock(){
  return(
    <div className={styles.TopBlock}>
      <button className={styles.button}><Icon.Wrench /><b>Settings</b></button>
      <button className={styles.button}><Icon.Friends /><b>Friends</b></button>
    </div>
  )
}