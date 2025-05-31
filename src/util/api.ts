import { APIResponse } from "@/dto/APIResponse";
import { getSessionCookie } from "./cookie";

interface apiOptions {
  url: string;
  method: "GET" | "PUT" | "POST" | "DELETE";
  body?: string;
}

export async function getApi<T>({ url, method, body }: apiOptions): Promise<T> {
  const token = getSessionCookie();

  // Create AbortController for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

  try {
    const response = await fetch(url, {
      method: method,
      headers: new Headers({
        Authorization: "Bearer " + token,
        ...(body && { "Content-Type": "application/json" }),
      }),
      body,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Check if response is ok (status 200-299)
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    // Check if response is JSON
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("Server returned non-JSON response");
    }

    const data: APIResponse<T> = await response.json();

    if (!data.success) {
      if (data.errorMessages && data.errorMessages.length > 0) {
        throw new Error(data.errorMessages[0]);
      } else {
        throw new Error("Server Error");
      }
    }

    return data.data!;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error) {
      if (error.name === "AbortError") {
        throw new Error("Request timed out after 10 seconds");
      }
      throw error;
    }

    throw new Error("Unknown error occurred");
  }
}
