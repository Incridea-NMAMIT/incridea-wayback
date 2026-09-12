import client from "./client";

export interface FeedbackData {
    name: string;
    email: string;
    contactNo: string;
    overallExperience: number;
    eventAndActivities: number;
    managementCoordination: number;
    infrastructureFacilities: number;
    suggestions: string;
    futureEngagement: boolean;
}

export const submitFeedback = async (data: FeedbackData) => {
    const result = await client.post('/feedback', data);
    return result.data;
};
