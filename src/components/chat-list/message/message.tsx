import styles from "./message.module.sass"

export default function Message(){
  return(
    <div className={styles.Message}>
      <span className={styles.name}><b>RynnLee</b></span>
      <span className={styles.messagePreview}>There once was a ship that...</span>
    </div>
  )
}