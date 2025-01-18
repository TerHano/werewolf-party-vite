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
    queryKeysToInvalidate?: string[][];
  };
}

export const useApiMutation = <ReturnType, Body>({
  mutation: { endpoint, method = "POST", queryKeysToInvalidate },
  onSuccess,
  onError,
}: useApiMutationProps<ReturnType, Body>) => {
  const queryClient = useQueryClient();
  let url = `${import.meta.env.WEREWOLF_SERVER_URL}/api/${endpoint}`;
  return useMutation<ReturnType, Error, Body>({
    //mutationKey:,
    mutationFn: (body: Body) => {
      let isValidDelete = false;
      if (method === "DELETE") {
        if (typeof body === "number") {
          console.log(body);
          url = url.replace("{id}", body.toString());
          isValidDelete = true;
        }
      }
      return getApi<ReturnType>({
        url,
        method,
        body: isValidDelete ? undefined : JSON.stringify(body),
      });
    },
    onSuccess: (data, variables) => {
      if (onSuccess) {
        onSuccess(data, variables);
      }
      if (queryKeysToInvalidate) {
        queryKeysToInvalidate.forEach((queryKey) => {
          queryClient.invalidateQueries({ queryKey: queryKey });
        });
      }
    },
    onError: onError,
  });
};
