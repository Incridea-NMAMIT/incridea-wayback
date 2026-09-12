import apiClient from './client'

export interface QuizStatus {
    canAttempt: boolean;
    nextAttemptTime: string | null;
}

export interface QuizQuestion {
    id: string;
    question: string;
    options: {
        id: string;
        option: string;
    }[];
}

export interface QuizSubmissionResult {
    success: boolean;
    isCorrect: boolean;
    points: number;
}

export const getDailyQuizStatus = async () => {
    const { data } = await apiClient.get<QuizStatus>('/leaderboard-quiz/status');
    return data;
}

export const getDailyQuestion = async () => {
    const { data } = await apiClient.get<{ question: QuizQuestion }>('/leaderboard-quiz/question');
    return data;
}

export const submitDailyQuizAnswer = async (questionId: string, optionId: string | null) => {
    const { data } = await apiClient.post<QuizSubmissionResult>('/leaderboard-quiz/submit', {
        questionId,
        optionId
    });
    return data;
}
