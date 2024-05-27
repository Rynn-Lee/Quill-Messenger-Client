import React, { Fragment, useEffect, useMemo } from 'react'
import styles from './messages.module.sass'
import Image from 'next/image'
import { message, messageHistory, useMessageStore } from '@/stores/messages-store'
import { userData } from '@/types/types'
import Icon from '@/assets/Icons'
import { calculateDate, differenceInMinutes, isDifferentDay } from '@/utils/calculate-date'
import { chat, friend } from '@/stores/chat-store'

type messageData = {
  message: message,
  user: userData,
  opponent: friend,
  date: Date
  index: number
  nextMessage: {date: string, samePerson: boolean, differentDate: boolean, minutes: number, doesNextExist: boolean}
}

export default function Messages({chatID, activeChat, user, refProp}: {chatID: string, activeChat: {chat: chat, friend: friend}, user: userData, refProp: any}){
  const {messagesHistory} = useMessageStore()

  return(
    <div className={styles.chatContent}>
      {!messagesHistory[chatID]?.messages?.length ? <span>The chat is empty!</span> : <></>}
      {messagesHistory[chatID]?.messages?.map((message: message, index: number) => {
        const date = new Date(message.createdAt)

        const nextMessage = {
          date: messagesHistory[chatID]?.messages[index+1]?.createdAt,
          samePerson: messagesHistory[chatID]?.messages[index+1]?.senderID == message.senderID,
          differentDate: isDifferentDay(message.createdAt, messagesHistory[chatID]?.messages[index+1]?.createdAt),
          minutes: differenceInMinutes(message.createdAt, messagesHistory[chatID]?.messages[index+1]?.createdAt),
          doesNextExist: messagesHistory[chatID]?.messages[index+1] ? true : false
        }

        return (
          <Fragment key={message.createdAt}>
            <Message 
              nextMessage={nextMessage}
              index={index}
              message={message}
              date={date}
              user={user}
              opponent={activeChat?.friend}/>
            <div ref={refProp} style={{display: 'none'}}/>
          </Fragment>
        )
      })}
    </div>
  )
}

function Message({message, user, opponent, date, index, nextMessage}: messageData){
  return(
    <Fragment key={message._id}>
    <div id={message._id} className={`${styles.message} ${message.senderID == user._id ? styles.rightMessage : styles.leftMessage}`}>
    {nextMessage.minutes > 5 || !nextMessage.samePerson || nextMessage.differentDate?
       <Image
        src={message.senderID == user._id ? user?.avatar : opponent?.avatar}
        alt="avatar"
        width={30}
        height={30}/>
    : <></>}

    
      <div className={`${styles.text} ${(!nextMessage.samePerson || (nextMessage.samePerson && nextMessage.differentDate)) ? (message.senderID == user._id ? styles.rightRow : styles.leftRow) : ""}`}>
        {message.text}<br/>
        <span className={styles.timeSent}>{calculateDate(date.toString(), 'time')}</span>
      </div>
    </div>

    {(!nextMessage.samePerson || nextMessage.minutes > 5 || (nextMessage.samePerson && nextMessage.differentDate))
      ?<div className={`${styles.arrow} ${message.senderID == user._id ? styles.floatRight : styles.floatleft}`}>
        {message.senderID == user._id ? <div className={styles.rightTriangle}><Icon.MessageTriangleRight/></div> : <div className={styles.leftTriangle}><Icon.MessageTriangleLeft/></div>}
      </div> : <></>
    }

    {nextMessage.differentDate ? <div className={styles.date}><span className={styles.line}/>{calculateDate(nextMessage.date, 'date')}<span className={styles.line}/></div> : <></>}
    {(!nextMessage.samePerson && !nextMessage.differentDate) || nextMessage.minutes > 5 ? <div className={styles.spacing}/> : <></>}
  </Fragment>
  )
}