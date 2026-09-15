import apiClient from './client';

export interface Task {
    id: string;
    key: string;
    title: string;
    description: string;
    xp: number;
    actionUrl: string;
    isCompleted: boolean;
    expiresAt?: string; // For active tasks
    hasHint?: boolean;
    hintTaken?: boolean;
    hint?: string;
}

export type TaskStatusResponse =
    | { status: 'LOCKED'; message?: string; canStart: boolean; task?: Partial<Task> }
    | { status: 'ACTIVE'; task: Task }
    | { status: 'COOLDOWN'; cooldownEnds: string }
    | { status: 'COMPLETED_ALL'; message: string };

export const getTaskStatus = async (): Promise<TaskStatusResponse> => {
    const { data } = await apiClient.get<TaskStatusResponse>(`/tasks/status?t=${Date.now()}`);
    return data;
};

export const startTask = async (): Promise<TaskStatusResponse> => {
    const { data } = await apiClient.post<TaskStatusResponse>('/tasks/start');
    return data;
};

export const revealHint = async (): Promise<{ hint: string }> => {
    const { data } = await apiClient.post<{ hint: string }>('/tasks/hint');
    return data;
};

export const completeTask = async (taskId: string): Promise<{ message: string; xp: number }> => {
    const { data } = await apiClient.post<{ message: string; xp: number }>('/tasks/complete', { taskId });
    return data;
};
