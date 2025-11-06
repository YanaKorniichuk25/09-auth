import axios, { AxiosRequestConfig, AxiosError } from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL + "/api";

export const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function apiRequest<T>(
  url: string,
  options?: AxiosRequestConfig
): Promise<T> {
  try {
    const response = await api.request<T>({
      url,
      ...options,
    });
    return response.data;
  } catch (error) {
    const err = error as AxiosError<{ message?: string }>;
    const message =
      err.response?.data?.message || err.message || "API request failed";
    throw new Error(message);
  }
}
