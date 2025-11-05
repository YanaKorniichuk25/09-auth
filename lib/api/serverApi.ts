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
