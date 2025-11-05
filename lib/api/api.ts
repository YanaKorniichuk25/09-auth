import axios, { AxiosRequestConfig } from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL + "/api";

export const api = axios.create({
  baseURL,
  withCredentials: true, // дозволяє працювати з куками
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
  } catch (err: any) {
    // Axios кидає помилку у response.data або message
    const message =
      err.response?.data?.message || err.message || "API request failed";
    throw new Error(message);
  }
}
