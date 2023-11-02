import Image from "next/image";

export default function UserBadge({styles}: any){
  return(
    <div className={styles.userBadge}>
      <Image src="https://avatars.githubusercontent.com/u/38906839?v=4" alt="pfp" width={60} height={60}/>
      <div className={styles.info}>
        <span className={styles.name}><b>Rynn Lee</b></span>
        <span>Tryna code</span>
      </div>
    </div>
  )
}