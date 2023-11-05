import React from 'react'
import socketio from 'socket.io-client'

// export const socket = socketio('192.168.2.104:4000')
export const socket = socketio
export const SocketContext = React.createContext()

// export const socketEvents = {
//   getConnectedUsers(){
//     socket.emit('getConnectedUsers', (data: any) => data)
//   }
// }