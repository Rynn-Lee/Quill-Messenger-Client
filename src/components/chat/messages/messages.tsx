import React, { Fragment, useContext, useEffect, useMemo } from 'react'
import styles from './messages.module.sass'
import Image from 'next/image'
import { message, messageHistory, useMessageStore } from '@/stores/messages-store'
import { userData } from '@/types/types'
import Icon from '@/assets/Icons'
import { calculateDate, differenceInMinutes, isDifferentDay } from '@/utils/calculate-date'
import { chat, friend } from '@/stores/chat-store'
import { decodeImage } from '@/utils/decodeImage'
import { netRequestHandler } from '@/utils/net-request-handler'
import { fetchUserByTagAPI } from '@/api/user-api'
import { WarningContext, warningHook } from '@/lib/warning/warning-context'
import { useUserCache } from '@/stores/user-cache'
import { tryCatch } from '@/utils/try-catch'
import { removeMessageAPI } from '@/api/message-api'
import { Socket } from 'socket.io-client'
import { SocketContext } from '@/context/socket-context'

type messageData = {
  message: message,
  createdAt: Date,
  user: userData,
  opponent: friend,
  date: Date
  index: number
  handleRemoveMessage: (message: message) => void
  nextMessage: {date: string, samePerson: boolean, differentDate: boolean, minutes: number, doesNextExist: boolean, createdAt: any, opponent: any, index: any} | any
} | any

export default function Messages({chatID, activeChat, user, refProp}: {chatID: string, activeChat: {chat: chat, friend: friend}, user: any, refProp: any}){
  const {messagesHistory, removeMessage} = useMessageStore()
  const warning = useContext<warningHook>(WarningContext)
  const socket: Socket | any = useContext(SocketContext)
  const userCache = useUserCache()

  const handleRemoveMessage = async(message: message) => {
    tryCatch(async() => {
      await netRequestHandler(()=>removeMessageAPI({_id: message._id}), warning)
      socket.emit('removeMessage', {messageID: message._id, chatID: chatID, recipientID: activeChat.chat.members})
      removeMessage(message)
    })
  }

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

        if(!userCache.userCache[message.senderID]){
          userCache.addUserCache(message.senderID)
        }

        return (
          <Fragment key={message.createdAt}>
            <Message 
              nextMessage={nextMessage}
              message={message}
              date={date}
              handleRemoveMessage={handleRemoveMessage}
              user={user}/>
            <div ref={refProp} style={{display: 'none'}}/>
          </Fragment>
        )
      })}
    </div>
  )
}

function Message({message, user, date, nextMessage, handleRemoveMessage}: messageData){
  const userCache = useUserCache()
  return(
    <Fragment key={message._id}>
    <div id={message._id} className={`${styles.message} ${message.senderID == user._id ? styles.rightMessage : styles.leftMessage}`}>

    {nextMessage.minutes > 5 || !nextMessage.samePerson || nextMessage.differentDate?
       <Image
        src={message.senderID == user._id ? user?.avatar : userCache.userCache[message.senderID]?.avatar}
        alt="avatar"
        width={30}
        height={30}/>
    : <></>}

    
      <div className={`${styles.text} ${(!nextMessage.samePerson || (nextMessage.samePerson && nextMessage.differentDate)) ? (message.senderID == user._id ? styles.rightRow : styles.leftRow) : ""}`}>
        
          {message.senderID == user._id
           ?  <div className={styles.removeMessage} onClick={() => handleRemoveMessage(message)}>
                <Icon.AddUser width='30px' height='30px' color='#9d58ec'/>
              </div> : null}

          <div className={styles.messageContent}>
            {message.type == 'media-text' || message.type == 'media' ? <Image src={message.text.code} style={{borderRadius: 10, marginBottom: 5}} width={300} height={300} alt=""/> : null}
            {message.text.text}
          </div>
        <span className={styles.timeSent}>{nextMessage.minutes > 5 || !nextMessage.samePerson || nextMessage.differentDate ? `${userCache.userCache[message.senderID]?.displayedName} | ` : ''}{calculateDate(date.toString(), 'time')}</span>
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