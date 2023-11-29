import Icon from '@/assets/Icons'
import styles from './chatlist.module.sass'
import Input from '../interface/Input'
import Message from '../message/message'
import { useChatStore } from '@store/chat-store'
import { useAccountStore } from '@store/account-store'
import { useEffect } from 'react'
import { getChats } from '@/api/chat-api'

export default function ChatList(){
  const {userChats, setUserChats}: any = useChatStore()
  const {_id}: any = useAccountStore()

  const fetchChats = async() => {
    setUserChats(await getChats(_id))
  }

  useEffect(()=>{
    !userChats && _id && fetchChats()
  }, [_id])

  useEffect(()=>{
    console.log(userChats)
  }, [userChats])

  return(
    <div className={styles.chatlist}>
      <h2>Messages</h2>
      <Input
        fancy={{text: "Search", placeholder: "User Tag"}}
        type="text"/>
      <fieldset className={styles.block}>
        <legend><Icon.Pin/> PINNED</legend>
        <Message
          avatar={"https://sun9-60.userapi.com/impg/NjD_4q2BZOy4hv6vM69wK8IpDKlSOAE-jFYnkg/AhkMtiKe1SU.jpg?size=736x736&quality=95&sign=cda2e26ff94697c124aa7deedf3ff611&type=album"}
          displayedName={"Daud Attano"}
          time={"3:06 AM"}
          message={"череп его"}/>
        <Message
          avatar={"https://sun9-44.userapi.com/impg/8rtcxGE4Pd5Z03OlfUZ8rDE9HcaWeAJZ2eAgIA/HicFJNf3_kw.jpg?size=894x893&quality=95&sign=895ccbc91c37e7b631717924274ad7af&type=album"}
          displayedName={"Lord Cookis"}
          time={"12:35 AM"}
          message={"Ну, пора кодить)"}/>
      </fieldset>
      <fieldset className={styles.block}>
        <legend><Icon.Letter/> ALL MESSAGES</legend>
        <Message
          avatar={"https://sun9-23.userapi.com/impf/c637628/v637628105/e846/FRet575Vh8U.jpg?size=1280x960&quality=96&sign=f169dfa14fc720cf6eb901664d51e223&type=album"}
          displayedName={"Maksima"}
          time={"3:18 AM"}
          message={"точняк"}/>
        <Message
          avatar={"https://avatars.githubusercontent.com/u/38906839?v=4"}
          displayedName={"RynnLee"}
          time={"Yesterday"}
          message={"Типа шизоид, сам себе пишу"}/>
        <Message
          avatar={"https://avatars.githubusercontent.com/u/47696233?v=4"}
          displayedName={"SketchPiece"}
          time={"A week ago"}
          message={"мне бы времени побольше в 24 часах"}/>
      </fieldset>
    </div>
  )
}