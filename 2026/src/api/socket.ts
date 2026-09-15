import { io } from 'socket.io-client'

const getSocketUrl = () => {
    if (typeof import.meta.env.VITE_API_URL === 'string' && import.meta.env.VITE_API_URL.length > 0) {
        return import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '')
    }
    return 'http://localhost:4000'
}

export const socket = io(getSocketUrl(), {
    autoConnect: false,
    transports: ['websocket', 'polling'] 
})
