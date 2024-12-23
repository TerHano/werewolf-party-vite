import { APIResponse } from "@/dto/APIResponse";
import { getApi } from "@/util/api";
import { getSessionCookie } from "@/util/cookie";
import { useQuery } from "@tanstack/react-query";

export interface useApiQueryProps<T> {
  queryKey: string[];
  query: {
    endpoint: string;
    params?: URLSearchParams;
    initialData?: T;
  };
}

export const useApiQuery = <T,>({
  queryKey,
  query: { endpoint, params, initialData },
}: useApiQueryProps<T>) => {
  let queryParams = "";
  if (params) {
    queryParams = "?" + params.toString();
  }
  const url = `${import.meta.env.WEREWOLF_SERVER_URL}/api/${endpoint}${queryParams}`;
  return useQuery({
    initialData: initialData,
    queryKey: queryKey,
    queryFn: () =>
      getApi<T>({
        url,
        method: "GET",
      }),
  });
};
