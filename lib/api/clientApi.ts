import { apiRequest } from "./api";
import type { Note } from "@/types/note";
import type { User } from "@/types/user";

export interface NotesResponse {
  notes: Note[];
  totalPages: number;
}

interface FetchNotesParams {
  page: number;
  perPage?: number;
  search?: string;
  tag?: string;
}

interface ApiMessage {
  message: string;
}

interface SessionStatus {
  success: boolean;
}

// Auth
export const register = (params: {
  email: string;
  password: string;
  username: string;
}): Promise<User> =>
  apiRequest<User>("/auth/register", { method: "POST", data: params });

export const login = (params: {
  email: string;
  password: string;
}): Promise<User> =>
  apiRequest<User>("/auth/login", { method: "POST", data: params });

export const logout = (): Promise<ApiMessage> =>
  apiRequest<ApiMessage>("/auth/logout", { method: "POST" });

export const checkSession = (): Promise<SessionStatus> =>
  apiRequest<SessionStatus>("/auth/session", { method: "GET" });

// User
export const getMe = (): Promise<User> =>
  apiRequest<User>("/users/me", { method: "GET" });

export const updateMe = (data: {
  username?: string;
  avatar?: string;
}): Promise<User> => apiRequest<User>("/users/me", { method: "PATCH", data });

// Notes
export const fetchNotes = (
  params: FetchNotesParams
): Promise<NotesResponse> => {
  const q = new URLSearchParams();
  q.set("page", String(params.page ?? 1));
  if (params.perPage) q.set("perPage", String(params.perPage));
  if (params.search) q.set("search", params.search);
  if (params.tag) q.set("tag", params.tag);
  return apiRequest<NotesResponse>(`/notes?${q.toString()}`, { method: "GET" });
};

export const getSingleNote = (id: string): Promise<Note> =>
  apiRequest<Note>(`/notes/${id}`, { method: "GET" });

export const createNote = (body: {
  title: string;
  content: string;
  tag?: string;
}): Promise<Note> => apiRequest<Note>("/notes", { method: "POST", data: body });

export const deleteNote = (id: string): Promise<Note> =>
  apiRequest<Note>(`/notes/${id}`, { method: "DELETE" });
