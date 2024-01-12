import { Fragment } from 'react'
import styles from './messages.module.sass'
import Image from 'next/image'

export default function Messages({messagesHistory, chatID, activeChat, user, refProp}: any){
  return(
    <div className={styles.chatContent}>
      {messagesHistory[chatID]?.messages?.map((message: any) => {
        const date = new Date(message.createdAt)
        return (
        <Fragment key={message._id}>
          <div id={message._id} className={`${styles.message} ${message.senderID == user._id ? styles.myMessage : styles.notMyMessage} ${styles.showAnim}`}>
            {activeChat?.friend?.avatar ? <Image
              src={message.senderID == user._id ? user.avatar : activeChat?.friend?.avatar}
              alt="avatar"
              width={30}
              height={30}/> : <></>}
            <div className={styles.text}>
              {message.text}<br/>
              <span className={styles.timeSent}>{`${date.getHours()}:${date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()}`}</span>
            </div>
          </div>
          <div ref={refProp} />
        </Fragment>
      )})}
      {!messagesHistory[chatID]?.messages?.length ? <span>The chat is empty!</span> : <></>}
    </div>
  )
}