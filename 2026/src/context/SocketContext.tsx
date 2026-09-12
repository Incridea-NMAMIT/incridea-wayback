import { createContext, useEffect, useState, type ReactNode } from 'react'
import { socket } from '../socket'
import { Socket } from 'socket.io-client'

interface SocketContextType {
  socket: Socket | null
  isConnected: boolean
}

export const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
})

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [socketInstance] = useState<Socket>(socket)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    function onConnect() {
      console.log('Socket connected')
      setIsConnected(true)
    }

    function onDisconnect() {
      console.log('Socket disconnected')
      setIsConnected(false)
    }

    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)

    if (socket.connected) {
      onConnect()
    }

    return () => {
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
    }
  }, [])

  return (
    <SocketContext.Provider value={{ socket: socketInstance, isConnected }}>
      {children}
    </SocketContext.Provider>
  )
}
