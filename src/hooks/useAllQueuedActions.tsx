import { QueuedActionDto } from "@/dto/QueuedActionDto";
import { useApiQuery } from "./useApiQuery";

export const useAllQueuedActions = (roomId: string) => {
  return useApiQuery<QueuedActionDto[]>({
    queryKey: ["all-queued-actions", roomId],
    query: {
      endpoint: `game/${roomId}/all-queued-actions`,
    },
  });
};
