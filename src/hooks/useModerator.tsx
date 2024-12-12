import { useApiQuery } from "./useApiQuery";

export const useModerator = (roomId: string) => {
  return useApiQuery<any>({
    queryKey: ["moderator"],
    query: {
      endpoint: `room/${roomId}/get-moderator`,
    },
  });
};
