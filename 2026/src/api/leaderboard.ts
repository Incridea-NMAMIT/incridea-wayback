import apiClient from './client'

export interface LeaderboardUser {
    userId: number;
    pid: string;
    name: string;
    avatar: string | null;
    points: number;
    todayPoints: number;
    rank: number;
}

export interface LeaderboardResponse {
    leaderboard: LeaderboardUser[];
    currentUser: LeaderboardUser | null;
}

export const fetchLeaderboard = async () => {
    const { data } = await apiClient.get<LeaderboardResponse>('/leaderboard');
    return data;
}
