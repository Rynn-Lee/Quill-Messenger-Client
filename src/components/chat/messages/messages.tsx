import { Fragment } from 'react'
import styles from './messages.module.sass'
import Image from 'next/image'
import { message, messageHistory } from '@/stores/messages-store'
import { chat, userData } from '@/types/types'
import { friend } from '@/stores/chat-store'
import Icon from '@/assets/Icons'

export default function Messages({messagesHistory, chatID, activeChat, user, refProp}: {messagesHistory: messageHistory, chatID: string, activeChat: {chat: chat, friend: friend}, user: userData, refProp: any}){
  return(
    <div className={styles.chatContent}>
      {messagesHistory[chatID]?.messages?.map((message: message, index: number) => {
        const date = new Date(message.createdAt)
        const isNextMessageSamePerson = messagesHistory[chatID]?.messages[index+1]?.senderID == message.senderID
        return (
        <Fragment key={message._id}>
          <div id={message._id} className={`${styles.message} ${message.senderID == user._id ? styles.rightMessage : styles.leftMessage}`}>
            {activeChat?.friend?.avatar && !isNextMessageSamePerson ? <Image
              src={message.senderID == user._id ? user.avatar : activeChat?.friend?.avatar}
              alt="avatar"
              width={30}
              height={30}/> : <></>}
            <div className={`${styles.text} ${!isNextMessageSamePerson ? (message.senderID == user._id ? styles.rightRow : styles.leftRow) : ""}`}>
              {message.text}<br/>
              <span className={styles.timeSent}>{`${date.getHours()}:${date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()}`} </span>
            </div>
          </div>
          {!isNextMessageSamePerson
            ?<div className={`${styles.arrow} ${message.senderID == user._id ? styles.floatRight : styles.floatleft}`}>
              {message.senderID == user._id ? <div className={styles.rightTriangle}><Icon.MessageTriangleRight/></div> : <div className={styles.leftTriangle}><Icon.MessageTriangleLeft/></div>}
            </div> : <></>
          }
          
          {!isNextMessageSamePerson ? <br/> : <></>}
          <div ref={refProp} />
        </Fragment>
      )})}
      {!messagesHistory[chatID]?.messages?.length ? <span>The chat is empty!</span> : <></>}
    </div>
  )
}