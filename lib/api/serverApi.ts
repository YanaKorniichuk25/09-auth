import { apiRequest, api } from "./api";
import type { Note } from "@/types/note";
import type { User } from "@/types/user";
import { cookies } from "next/headers";
import type { AxiosResponse } from "axios";

interface FetchNotesParams {
  page: number;
  perPage?: number;
  search?: string;
  tag?: string;
}

async function buildCookieHeader() {
  const cookieStore = await cookies();
  const entries = cookieStore.getAll().map((c) => `${c.name}=${c.value}`);
  return entries.join("; ");
}

export const fetchNotes = async (params: FetchNotesParams) => {
  const cookieHeader = await buildCookieHeader();
  const q = new URLSearchParams();
  q.set("page", String(params.page ?? 1));
  if (params.perPage) q.set("perPage", String(params.perPage));
  if (params.search) q.set("search", params.search);
  if (params.tag) q.set("tag", params.tag);
  return apiRequest(`/notes?${q.toString()}`, {
    method: "GET",
    headers: { Cookie: cookieHeader },
  });
};

export const getSingleNote = async (id: string): Promise<Note> => {
  const cookieHeader = await buildCookieHeader();
  return apiRequest<Note>(`/notes/${id}`, {
    method: "GET",
    headers: { Cookie: cookieHeader },
  });
};

export const getMe = async (): Promise<User | null> => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  if (!accessToken) return null;
  const cookieHeader = await buildCookieHeader();
  return apiRequest<User>("/users/me", {
    method: "GET",
    headers: { Cookie: cookieHeader },
  });
};

export const checkSession = async (): Promise<
  AxiosResponse<{ success: boolean }>
> => {
  const cookieHeader = await buildCookieHeader();

  return api.request<{ success: boolean }>({
    url: "/auth/session",
    method: "GET",
    headers: { Cookie: cookieHeader },
  });
};
