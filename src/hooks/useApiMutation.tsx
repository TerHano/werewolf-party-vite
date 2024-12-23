import { APIResponse } from "@/dto/APIResponse";
import { getApi } from "@/util/api";
import { getSessionCookie } from "@/util/cookie";
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

export const useApiMutation = <ReturnType, Body>({
  mutation: { endpoint, method = "POST", queryKeysToInvalidate },
  onSuccess,
  onError,
}: useApiMutationProps<ReturnType, Body>) => {
  const queryClient = useQueryClient();
  const url = `${import.meta.env.WEREWOLF_SERVER_URL}/api/${endpoint}`;
  return useMutation({
    //mutationKey:,
    mutationFn: (body: Body) =>
      getApi<ReturnType>({
        url,
        method,
        body: JSON.stringify(body),
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
