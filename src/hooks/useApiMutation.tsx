import { APIResponse } from "@/dto/APIResponse";
import { getCookie } from "@/util/cookie";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export interface mutationOptions<T, K> {
  onSuccess?: (data: T, variables: K) => Promise<unknown>;
  onError?: (error: Error, variables: K) => Promise<unknown>;
}

export interface useApiMutationProps<T, K> extends mutationOptions<T, K> {
  // mutationKey?: string[];
  mutation: {
    endpoint: string;
    method?: "PUT" | "POST" | "DELETE";
    queryKeysToInvalidate?: string[];
  };
}

export const useApiMutation = <T, K>({
  mutation: { endpoint, method = "POST", queryKeysToInvalidate },
  onSuccess,
  onError,
}: useApiMutationProps<T, K>) => {
  const token = getCookie("session");
  const queryClient = useQueryClient();
  return useMutation({
    //mutationKey:,
    mutationFn: (body: K) =>
      fetch(`${import.meta.env.WEREWOLF_SERVER_URL}/api/${endpoint}`, {
        method: method,
        body: JSON.stringify(body),
        headers: new Headers({
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        }),
      })
        .then((res) => res.json())
        .then((res: APIResponse<T>) => {
          if (!res.success) {
            if (res.errorMessages && res.errorMessages.length > 0) {
              throw new Error(res.errorMessages[0]);
            } else throw new Error("Server Error");
          }
          return res.data!;
        }),
    onSuccess: (data, variables) => {
      if (onSuccess) {
        onSuccess(data, variables);
      }
      if (queryKeysToInvalidate) {
        queryClient.invalidateQueries({ queryKey: queryKeysToInvalidate });
      }
    },
    onError: onError,
  });
};
