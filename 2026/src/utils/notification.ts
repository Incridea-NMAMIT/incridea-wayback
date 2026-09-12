import apiClient from '../api/client'

export const getNotifications = async () => {
    return await apiClient.get('/notifications')
}

export const markNotificationAsRead = async (id: string) => {
    return await apiClient.patch(`/notifications/${id}/read`)
}

export const deleteNotification = async (id: string) => {
    return await apiClient.delete(`/notifications/${id}`)
}

