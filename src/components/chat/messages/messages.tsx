import React, { Fragment } from 'react'
import styles from './messages.module.sass'
import Image from 'next/image'
import { message, messageHistory } from '@/stores/messages-store'
import { userData } from '@/types/types'
import Icon from '@/assets/Icons'
import { calculateDate, differenceInMinutes, isDifferentDay } from '@/utils/calculate-date'
import { friend } from '@/stores/chat-store'

type messageData = {
  message: message,
  nextMessage: {
    date: string,
    samePerson: boolean,
    differentDate: boolean,
    minutes: number
  },
  user: userData,
  opponent: friend,
  date: Date
}

export default function Messages({messagesHistory, chatID, activeChat, user, refProp}: {messagesHistory: messageHistory, chatID: string, activeChat: any, user: userData, refProp: any}){
  return(
    <div className={styles.chatContent}>
      {!messagesHistory[chatID]?.messages?.length ? <span>The chat is empty!</span> : <></>}
      {messagesHistory[chatID]?.messages?.map((message: message, index: number) => {
        const date = new Date(message.createdAt)
        const nextMessage = {
          date: messagesHistory[chatID]?.messages[index+1]?.createdAt,
          samePerson: messagesHistory[chatID]?.messages[index+1]?.senderID == message.senderID,
          differentDate: isDifferentDay(message.createdAt, messagesHistory[chatID]?.messages[index+1]?.createdAt),
          minutes: differenceInMinutes(message.createdAt, messagesHistory[chatID]?.messages[index+1]?.createdAt)
        }

        return (
          <Fragment key={message._id}>
            <Message 
              message={message}
              nextMessage={nextMessage}
              user={user}
              opponent={activeChat?.friend}
              date={date}/>
            <div ref={refProp} style={{display: 'none'}}/>
          </Fragment>
        )
      })}
    </div>
  )
}

const Message = React.memo(function Message({message, nextMessage, user, opponent, date}: messageData){
  console.log("MessgeRerendered")
  return(
    <Fragment key={message._id}>
    <div id={message._id} className={`${styles.message} ${message.senderID == user._id ? styles.rightMessage : styles.leftMessage}`}>
      {!nextMessage.samePerson || nextMessage.differentDate || nextMessage.minutes > 5 ? <Image
        src={message.senderID == user._id ? user.avatar : opponent.avatar}
        alt="avatar"
        width={30}
        height={30}/> : <></>}

      <div className={`${styles.text} ${(!nextMessage.samePerson || (nextMessage.samePerson && nextMessage.differentDate)) ? (message.senderID == user._id ? styles.rightRow : styles.leftRow) : ""}`}>
        {message.text}<br/>
        <span className={styles.timeSent}>{calculateDate(date.toString(), 'time')} </span>
      </div>
    </div>

    {(!nextMessage.samePerson || nextMessage.minutes > 5 || (nextMessage.samePerson && nextMessage.differentDate))
      ?<div className={`${styles.arrow} ${message.senderID == user._id ? styles.floatRight : styles.floatleft}`}>
        {message.senderID == user._id ? <div className={styles.rightTriangle}><Icon.MessageTriangleRight/></div> : <div className={styles.leftTriangle}><Icon.MessageTriangleLeft/></div>}
      </div> : <></>
    }

    {(!nextMessage.samePerson && !nextMessage.differentDate) || nextMessage.minutes > 5 ? <div className={styles.spacing}/> : <></>}

    {nextMessage.differentDate ? <div className={styles.date}><span className={styles.line}/>{calculateDate(nextMessage.date, 'date')}<span className={styles.line}/></div> : <></>}
  </Fragment>
  )
})