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

export const deleteNote = (id: string): Promise<void> => {
  return apiRequest<void>(`/notes/${id}`, { method: "DELETE" });
};

export const createNote = (note: {
  title: string;
  content: string;
  tag: string;
}): Promise<Note> => {
  return apiRequest<Note>("/notes", { method: "POST", data: note });
};

export const register = (credentials: {
  email: string;
  password: string;
}): Promise<User> => {
  return apiRequest<User>("/auth/register", {
    method: "POST",
    data: credentials,
  });
};

export const login = (credentials: {
  email: string;
  password: string;
}): Promise<User> => {
  return apiRequest<User>("/auth/login", { method: "POST", data: credentials });
};

export const logout = (): Promise<void> => {
  return apiRequest<void>("/auth/logout", { method: "POST" });
};

export const checkSession = (): Promise<User | null> => {
  return apiRequest<User>("/auth/session");
};

export const getMe = (): Promise<User | null> => {
  return apiRequest<User>("/users/me");
};

export const updateMe = (data: {
  username?: string;
  avatar?: string;
}): Promise<User> => {
  return apiRequest<User>("/users/me", { method: "PATCH", data });
};
