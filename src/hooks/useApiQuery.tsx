import { APIResponse } from "@/dto/APIResponse";
import { getCookie } from "@/util/cookie";
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
  const token = getCookie("session");
  let queryParams = "";
  if (params) {
    queryParams = "?" + params.toString();
  }
  return useQuery({
    initialData: initialData,
    queryKey: queryKey,
    queryFn: () =>
      fetch(
        `${import.meta.env.WEREWOLF_SERVER_URL}/api/${endpoint}${queryParams}`,
        {
          method: "GET",
          headers: new Headers({
            Authorization: "Bearer " + token,
          }),
        }
      )
        .then((res) => res.json())
        .then((res: APIResponse<T>) => {
          if (!res.success) {
            if (res.errorMessages && res.errorMessages.length > 0) {
              throw new Error(res.errorMessages[0]);
            } else throw new Error("Server Error");
          }
          return res.data;
        }),
  });
};
