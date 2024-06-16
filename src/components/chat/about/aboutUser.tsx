import { friend, useChatStore } from "@/stores/chat-store";
import styles from "./about.module.sass"
import Image from 'next/Image'
import Icon from "@/assets/Icons";
import { calculateDate } from "@/utils/calculate-date";
import { useUserCache } from "@/stores/user-cache";
import { useContext, useState } from "react";
import { open } from '@tauri-apps/api/dialog';
import { readBinaryFile } from "@tauri-apps/api/fs"
import { netRequestHandler } from "@/utils/net-request-handler";
import { editGroupAPI } from "@/api/group-api";
import { decodeImage } from "@/utils/decodeImage";
import { useAccountStore } from "@/stores/account-store";
import { Socket } from "socket.io-client";
import { SocketContext } from "@/context/socket-context";

export default function AboutUser({friend, chatInfo, setIsFriendInfoOpen}: {friend: friend | any, chatInfo:any, setIsFriendInfoOpen: Function}) {
  const userCache = useUserCache()
  const chatStore = useChatStore()
  const socket: Socket | any = useContext(SocketContext)
  const account = useAccountStore()
  const [editMode, setEditMode] = useState(false)
  const [newData, setNewData] = useState({
    name: friend.displayedName,
    image: {
      format: 'jpg',
      code: chatInfo.members.length < 3 ? friend?.avatar : chatInfo.image.code
    },
  })
  
  const openImageDialog = async() => {
    try{
      const selectedPath = await open({
        multiple: false,
        filters: [
          {
            name: "Image",
            extensions: ["png", "jpg", "jpeg", 'webp', 'gif']
          }
        ],
        title: "Choose a photo"
      })
      if(!selectedPath) return;
      const Buffer = await readBinaryFile(selectedPath as string)
      const dataUrl = `data:image/jpg;base64,${btoa(Buffer.reduce((data, byte) => data + String.fromCharCode(byte), ''))}`

      setNewData({...newData, image: {...newData.image, code: dataUrl}})
      
    } catch (err) {
      console.log(err)
    }
  }

  const saveGroupInfo = async() => {
    try{
      const result = await netRequestHandler(()=>editGroupAPI({_id: chatInfo._id, data: newData}))
      const {image, name} = result.data
      if(!result.data){return}
      setEditMode(false)
      chatStore.editChat({_id: chatInfo._id, name, image})
      chatStore.setActiveChat({chat: {...chatInfo, name, image}, friend: {...friend, displayedName: name, image}})
      socket.emit('editGroup', {data: {_id: chatInfo._id, name, image}, recipientID: chatInfo.members})
      account.incTrigger()
    } catch (err) {
      console.log(err)
    }
  }

  return(
    <div className={styles.aboutUser} onClick={(e) => {setIsFriendInfoOpen(false)}}>
      <div className={styles.userInfo} onClick={(e)=>e.stopPropagation()}>
        <div className={styles.pfpblock}>
          <Image src={editMode 
                        ? newData?.image?.code
                          ? newData?.image?.code
                          : chatInfo.members.length < 3 ? friend?.avatar : decodeImage(chatInfo.image.code)
                        : chatInfo.members.length < 3 ? friend?.avatar : decodeImage(chatInfo.image.code)} width={120} height={120} alt="avatar" style={{cursor: editMode ? 'pointer' : 'default'}} onClick={() => {editMode && openImageDialog()}}/>
        </div>
        <div className={styles.infoblock}>
          <div>
            {!editMode
            ? <span className={styles.row + " " + styles.username} onClick={() => {friend.type == "group" && setEditMode(!editMode)}}>{friend.displayedName} </span>
            : <div style={{display: 'flex', alignItems: 'center', gap: '5px', flex: 3, justifyContent: 'center', marginBottom: '10px', marginRight: '12px'}}>
                <input type="text" value={newData.name} className={styles.groupInputName} onChange={(e) => setNewData({...newData, name: e.target.value})}/>
                <button style={{width: 'auto', margin: 0}} onClick={() => saveGroupInfo()}>
                  <Icon.EditPen width="24px" height="24px" color="#ffffff"/>
                </button>
                <button style={{width: 'auto', padding: 9}} onClick={() => {setEditMode(!editMode); setNewData({name: friend.displayedName, avatar: ""})}}>
                  <Icon.deleteIcon width="18px" height="18px" color="#cacaca"/>
                </button>
              </div>
            }
            <div className={styles.row}><span style={{display: 'flex', alignItems: 'center', gap: '5px', flex: 3}}><Icon.User/>{friend.usertag}</span></div>
            {friend?.type! != 'group'
              ? <span className={styles.row}><Icon.Calendar color="#fff" width="26px" height="20px"/> {friend?._id && calculateDate(friend.createdAt.toString(), 'full')}</span>
              : <div className={styles.userlist}>{
                  chatInfo?.members?.map((id: string) => {
                    if(!userCache?.userCache[id]?._id){
                      userCache.addUserCache(id)
                    }
                    return(<span className={styles.userRow}>
                            <Image src={userCache?.userCache[id]?.avatar ?? ""} width={30} height={30} alt="avatar"/>
                            <div style={{display: 'flex', flexDirection: 'column'}}>
                              <span>{userCache?.userCache[id]?.displayedName}</span>
                              <span style={{opacity: 0.5, fontSize: 12}}>{userCache?.userCache[id]?.usertag}</span>
                            </div>
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