import { apiRequest } from "./api";
import type { Note } from "@/types/note";

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

export const deleteNote = async (id: string): Promise<void> => {
  await apiRequest<void>(`/notes/${id}`, { method: "DELETE" });
};

export const createNote = async (note: {
  title: string;
  content: string;
  tag: string;
}): Promise<Note> => {
  return apiRequest<Note>("/notes", {
    method: "POST",
    data: note, // <-- замість body
  });
};
