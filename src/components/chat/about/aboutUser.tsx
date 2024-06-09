import { friend } from "@/stores/chat-store";
import styles from "./about.module.sass"
import Image from 'next/Image'
import Icon from "@/assets/Icons";
import { calculateDate } from "@/utils/calculate-date";
import { useUserCache } from "@/stores/user-cache";

export default function AboutUser({friend, chatInfo, setIsFriendInfoOpen}: {friend: friend, chatInfo:any, setIsFriendInfoOpen: Function}) {
  const userCache = useUserCache()
  return(
    <div className={styles.aboutUser} onClick={(e) => {e.stopPropagation();setIsFriendInfoOpen(false)}}>
      <div className={styles.userInfo}>
        <div className={styles.pfpblock}>
          <Image src={friend?.avatar ?? chatInfo.image} width={120} height={120} alt="avatar"/>
        </div>
        <div className={styles.infoblock}>
          <div>
            <span className={styles.row + " " + styles.username}>{friend.displayedName}</span>
            <span className={styles.row}><Icon.User/> {friend.usertag}</span>
            {friend?.type! == 'group' ? <><hr/><br/></> : null}
            {friend?.type! != 'group'
              ? <span className={styles.row}><Icon.Calendar color="#fff" width="26px" height="20px"/> {friend?._id && calculateDate(friend.createdAt.toString(), 'full')}</span>
              : <div className={styles.userlist}>{
                  chatInfo.members.map((id: string) => {
                    if(!userCache?.userCache[id]?._id){
                      userCache.addUserCache(id)
                    }
                    return(<span className={styles.userRow}>
                            <Image src={userCache?.userCache[id]?.avatar} width={30} height={30} alt="avatar"/>
                            {userCache?.userCache[id]?.displayedName}
                          </span>)
                  })
                }
                </div>
            }
          </div>
        </div>
      </div>
    </div>
  )
}