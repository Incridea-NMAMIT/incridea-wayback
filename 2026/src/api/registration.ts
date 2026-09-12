import apiClient from './client'

export interface TeamMember {
  id: number
  pidId: number
  teamId: number
  PID?: {
    User: {
      id: number
      name: string
      email: string
    }
  }
}

export interface Team {
  id: number
  name: string
  eventId: number
  leaderId: number
  confirmed: boolean
  roundNo: number
  TeamMembers: TeamMember[]
  Leader?: {
    User: {
      id: number
      name: string
      email: string
    }
  }
  eventParticipantId?: number
}

export async function registerSoloEvent(eventId: number) {
  const { data } = await apiClient.post<Team>('/registration/solo', { eventId })
  return data
}

export async function createTeam(eventId: number, name: string) {
  const { data } = await apiClient.post<Team>('/registration/create-team', { eventId, name })
  return data
}

export async function joinTeam(eventId: number, teamId: number) {
  const { data } = await apiClient.post<TeamMember>('/registration/join-team', { eventId, teamId })
  return data
}

export async function getMyTeam(eventId: number) {
  const { data } = await apiClient.get<{ team: Team | null }>(`/registration/my-team/${eventId}`)
  return data.team
}

export async function confirmTeam(teamId: number) {
  const { data } = await apiClient.post<Team>('/registration/confirm-team', { teamId })
  return data
}

export async function leaveTeam(teamId: number) {
  const { data } = await apiClient.post<{ count: number }>('/registration/leave-team', { teamId })
  return data
}

export async function deleteTeam(teamId: number) {
  const { data } = await apiClient.post<Team>('/registration/delete-team', { teamId })
  return data
}

export interface RegisteredEvent {
  title: string
  code: string
  image: string | null
  category: string
  eventId: number
  teamName: string | null
  type: 'INDIVIDUAL' | 'TEAM'
}

export async function getMyRegisteredEvents() {
  const { data } = await apiClient.get<RegisteredEvent[]>('/registration/my-registrations')
  return data
}

export async function getRecommendedEvents() {
  const { data } = await apiClient.get<RegisteredEvent[]>('/registration/recommendations')
  return data
}

export interface PaymentInitiateResponse {
  orderId: string
  amount: number
  currency: string
  key: string
  name: string
  description: string
  prefill?: any
}

export interface InitiatePaymentOptions {
  includeMerch?: boolean
  size?: string
  year?: string
  section?: string
  branch?: string
  usn?: string
  dept?: string
}

export async function initiatePayment(registrationId: string, options?: InitiatePaymentOptions) {
  const { data } = await apiClient.post<PaymentInitiateResponse>('/payment/initiate', { registrationId, ...options })
  return data
}


export async function verifyPaymentSignature(response: any) {
  const { data } = await apiClient.post<any>('/payment/verify', response)
  return data
}

export async function getPaymentStatus(type?: string) {
  try {
    const url = type ? `/payment/my-status?type=${type}` : '/payment/my-status'
    const { data } = await apiClient.get<any>(url)
    if (data.status === 'success') {
      return {
        status: 'success',
        message: 'Payment verified',
        pid: data.pid,
        receipt: data.receipt,
        processingStep: 'COMPLETED'
      }
    }
    if (data.status === 'processing' || data.status === 'pending') {
      return {
        status: 'pending',
        message: data.message || 'Processing...',
        processingStep: data.processingStep,
        receipt: data.receipt,
        pid: data.pid
      }
    }
    if (data.status === 'failed') {
      return {
        status: 'failed',
        message: data.message || 'Payment Verification Failed',
        processingStep: null
      }
    }
  } catch (e) {
  }
  return { status: 'pending', message: 'Payment verification pending', processingStep: null }
}
