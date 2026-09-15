import apiClient from './client'

export interface PublicQuizQuestion {
    id: string
    question: string
    description?: string
    isCode: boolean
    image?: string
    options: {
        id: string
        value: string
    }[]
}

export interface PublicQuiz {
    id: string
    name: string
    description?: string
    startTime: string
    endTime: string
    allowAttempts: boolean
    questions: PublicQuizQuestion[]
    teamId?: number
    attemptStartTime?: string
    hasPassword: boolean
    isLocked: boolean
    isLate: boolean
    userSubmissions?: Record<string, string>
}

export const getPublicQuiz = async (quizId: string) => {
    const { data } = await apiClient.get<{ quiz: PublicQuiz }>(`/quiz/${quizId}`)
    return data
}

export const startQuiz = async (quizId: string, payload: { teamId: number, pin?: string }) => {
    const { data } = await apiClient.post<{ success: boolean, attemptStartTime: string }>(`/quiz/${quizId}/start`, payload)
    return data
}

export const submitQuizAnswer = async (quizId: string, payload: { optionId: string, teamId: number }) => {
    const { data } = await apiClient.post<{ success: boolean }>(`/quiz/${quizId}/submit`, payload)
    return data
}

export const finishQuiz = async (quizId: string, payload: { teamId: number }) => {
    const { data } = await apiClient.post<{ success: boolean, score: number, timeTaken: number }>(`/quiz/${quizId}/finish`, payload)
    return data
}

export const lockQuiz = async (quizId: string, payload: { teamId: number, type: string }) => {
    const { data } = await apiClient.post<{ success: boolean, isLocked: boolean }>(`/quiz/${quizId}/lock`, payload)
    return data
}

export const verifyPin = async (quizId: string, payload: { teamId: number, pin: string }) => {
    const { data } = await apiClient.post<{ success: boolean, valid: boolean }>(`/quiz/${quizId}/verify-pin`, payload)
    return data
}

