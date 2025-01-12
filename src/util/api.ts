import { APIResponse } from "@/dto/APIResponse";
import { getSessionCookie } from "./cookie";

interface apiOptions {
  url: string;
  method: "GET" | "PUT" | "POST" | "DELETE";
  body?: string;
}

export function getApi<T>({ url, method, body }: apiOptions): Promise<T> {
  const token = getSessionCookie();
  return fetch(url, {
    method: method,
    headers: new Headers({
      Authorization: "Bearer " + token,
      ...(body && { "Content-Type": "application/json" }),
    }),
    body,
  })
    .then((res) => res.json())
    .then((res: APIResponse<T>) => {
      if (!res.success) {
        if (res.errorMessages && res.errorMessages.length > 0) {
          throw new Error(res.errorMessages[0]);
        } else throw new Error("Server Error");
      }
      return res.data!;
    });
}
