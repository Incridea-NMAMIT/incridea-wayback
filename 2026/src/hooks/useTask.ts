import { useMutation, useQueryClient } from "@tanstack/react-query";
import { showToast } from "../utils/toast";
import { completeTask as completeTaskApi, revealHint } from "../api/task";

export const useTask = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (taskId: string) => completeTaskApi(taskId),
        onSuccess: () => {
            showToast("Task Completed: +100 XP!", "success");
            queryClient.invalidateQueries({ queryKey: ["me"] });
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
            queryClient.resetQueries({ queryKey: ["taskStatus"] });
            queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
        },
        onError: (err: any) => {
            // If task is already completed (409 Conflict), we should still refresh the UI
            if (err.response?.status === 409 || err.response?.data?.message === 'Task already completed') {
                queryClient.invalidateQueries({ queryKey: ["me"] });
                queryClient.invalidateQueries({ queryKey: ["tasks"] });
                queryClient.invalidateQueries({ queryKey: ["taskStatus"] });
                queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
                return;
            }
        },
    });

    const completeTaskSafe = async (taskId: string) => {
        try {
            await mutation.mutateAsync(taskId);
        } catch (error) {
            // Error is handled in onError above
        }
    };

    return {
        completeTask: completeTaskSafe,
        isLoading: mutation.isPending,
    };
};

export const useRevealHint = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: revealHint,
        onSuccess: () => {
            showToast("Hint Revealed!", "success");
            queryClient.invalidateQueries({ queryKey: ["taskStatus"] });
        },
        onError: (err: any) => {
            const message = err.response?.data?.message || "Failed to reveal hint";
            showToast(message, "error");
        }
    });

    return {
        revealHint: mutation.mutate,
        isLoading: mutation.isPending
    };
};
