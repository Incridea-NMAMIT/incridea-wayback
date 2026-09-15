import apiClient from './client'

export interface InitiatePaymentResponse {
    orderId: string
    amount: number
    currency: string
    key: string
    name: string
    description: string
    prefill?: {
        name?: string
        email?: string
        contact?: string
    }
}

export const initiatePayment = async (data: {
    registrationId: string
    semester?: string
    branch?: string
    usn?: string
    section?: string
    size?: string
    merchItems?: { size: string }[]
}) => {
    const response = await apiClient.post<InitiatePaymentResponse>('/payment/initiate', data)
    return response.data
}

export const verifyPayment = async (data: {
    razorpay_order_id: string
    razorpay_payment_id: string
    razorpay_signature: string
}) => {
    const response = await apiClient.post<{ status: string; message: string; pid?: string }>('/payment/verify', data)
    return response.data
}

export const getMyPaymentStatus = async (type: string) => {
    const response = await apiClient.get<{ status: string; message: string; pid?: string; receipt?: string; merchOrders?: { id: string, paymentOrderId: string, size: string }[] }>(`/payment/my-status?type=${type}`)
    return response.data
}
