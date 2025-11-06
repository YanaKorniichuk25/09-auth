import { apiRequest } from "./api";
import type { Note } from "@/types/note";
import type { User } from "@/types/user";
import { cookies } from "next/headers";

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

export const fetchNotesServer = async ({
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

export const getSingleNote = async (id: string): Promise<Note> => {
  return apiRequest<Note>(`/notes/${id}`);
};

export const getMe = async (): Promise<User | null> => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  if (!accessToken) return null;

  return apiRequest<User>("/users/me", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
};
