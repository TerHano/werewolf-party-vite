import { getApi } from "@/util/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export interface mutationOptions<ReturnType, Body> {
  onSuccess?: (data: ReturnType, variables: Body) => Promise<void>;
  onError?: (error: Error, variables: Body) => Promise<void>;
}

export interface useApiMutationProps<ReturnType, Body>
  extends mutationOptions<ReturnType, Body> {
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
  return useMutation<ReturnType, Error, Body>({
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
