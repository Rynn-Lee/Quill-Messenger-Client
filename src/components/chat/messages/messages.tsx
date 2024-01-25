import { Fragment, useEffect } from 'react'
import styles from './messages.module.sass'
import Image from 'next/image'
import { message, messageHistory } from '@/stores/messages-store'
import { userData } from '@/types/types'
import Icon from '@/assets/Icons'
import { calculateDate, isDifferentDay } from '@/utils/calculate-date'

export default function Messages({messagesHistory, chatID, activeChat, user, refProp}: {messagesHistory: messageHistory, chatID: string, activeChat: any, user: userData, refProp: any}){
  return(
    <div className={styles.chatContent}>
      {messagesHistory[chatID]?.messages?.map((message: message, index: number) => {
        const date = new Date(message.createdAt)
        const nextMessageDate = messagesHistory[chatID]?.messages[index+1]?.createdAt
        const isNextMessageSamePerson = messagesHistory[chatID]?.messages[index+1]?.senderID == message.senderID
        const isDifferentDate = isDifferentDay(message.createdAt, nextMessageDate)
        return (
        <Fragment key={message._id}>
          <div id={message._id} className={`${styles.message} ${message.senderID == user._id ? styles.rightMessage : styles.leftMessage}`}>
            {(!isNextMessageSamePerson || isDifferentDate) ? <Image
              src={message.senderID == user._id ? user.avatar : activeChat?.friend?.avatar}
              alt="avatar"
              width={30}
              height={30}/> : <></>}
            <div className={`${styles.text} ${(!isNextMessageSamePerson || (isNextMessageSamePerson && isDifferentDate)) ? (message.senderID == user._id ? styles.rightRow : styles.leftRow) : ""}`}>
              {message.text}<br/>
              <span className={styles.timeSent}>{`${date.getHours()}:${date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()}`} </span>
            </div>
          </div>
          {(!isNextMessageSamePerson || (isNextMessageSamePerson && isDifferentDate))
            ?<div className={`${styles.arrow} ${message.senderID == user._id ? styles.floatRight : styles.floatleft}`}>
              {message.senderID == user._id ? <div className={styles.rightTriangle}><Icon.MessageTriangleRight/></div> : <div className={styles.leftTriangle}><Icon.MessageTriangleLeft/></div>}
            </div> : <></>
          }
          {!isNextMessageSamePerson && !isDifferentDate ? <br/> : <></>}
          <div ref={refProp} />
          {isDifferentDate ? <div className={styles.date}><span className={styles.line}/>{calculateDate('en-EN', nextMessageDate, 'date')}<span className={styles.line}/></div> : <></>}
        </Fragment>
      )})}
      {!messagesHistory[chatID]?.messages?.length ? <span>The chat is empty!</span> : <></>}
    </div>
  )
}