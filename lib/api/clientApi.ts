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

export const fetchNotes = async ({
  page,
  perPage = 12,
  search,
  tag,
}: FetchNotesParams): Promise<NotesResponse> => {
  const query = new URLSearchParams({
    page: String(page),
    perPage: String(perPage),
  });
  if (search) query.append("search", search);
  if (tag) query.append("tag", tag);

  return apiRequest<NotesResponse>(`/notes?${query.toString()}`);
};

export const getSingleNote = (id: string): Promise<Note> => {
  return apiRequest<Note>(`/notes/${id}`);
};

export const deleteNote = async (id: string): Promise<void> => {
  await apiRequest<void>(`/notes/${id}`, { method: "DELETE" });
};

export const createNote = async (note: {
  title: string;
  content: string;
  tag: string;
}): Promise<Note> => {
  return apiRequest<Note>("/notes", { method: "POST", data: note });
};

export const register = async (credentials: {
  email: string;
  password: string;
}): Promise<User> => {
  return apiRequest<User>("/auth/register", {
    method: "POST",
    data: credentials,
  });
};

export const login = async (credentials: {
  email: string;
  password: string;
}): Promise<User> => {
  return apiRequest<User>("/auth/login", { method: "POST", data: credentials });
};

export const logout = async (): Promise<void> => {
  await apiRequest<void>("/auth/logout", { method: "POST" });
};

export const checkSession = async (): Promise<User | null> => {
  try {
    return await apiRequest<User>("/auth/session");
  } catch (error: any) {
    if (error.message.includes("401")) return null;
    throw error;
  }
};

export const getMe = async (): Promise<User | null> => {
  try {
    return await apiRequest<User>("/users/me");
  } catch (error: any) {
    if (error.message.includes("401")) return null;
    throw error;
  }
};

export const updateMe = async (data: {
  username?: string;
  avatar?: string;
}): Promise<User> => {
  return apiRequest<User>("/users/me", { method: "PATCH", data });
};
