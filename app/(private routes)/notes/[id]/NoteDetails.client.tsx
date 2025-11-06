"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getSingleNote } from "@/lib/api/clientApi";
import { Note } from "@/types/note";
import Modal from "@/components/Modal/Modal";
import css from "./NoteDetails.module.css";

export default function NoteDetailsClient() {
  const { id } = useParams();
  const router = useRouter();
  const noteId = Array.isArray(id) ? id[0] : id;

  const {
    data: note,
    isLoading,
    isError,
    error,
  } = useQuery<Note>({
    queryKey: ["note", noteId],
    queryFn: () => getSingleNote(noteId!),
    refetchOnMount: false,
  });

  const handleClose = () => router.back();

  if (isLoading) return <p>Loading, please wait...</p>;
  if (isError || !note) return <p>Something went wrong: {error?.message}</p>;

  return (
    <div className={css.container}>
      <Modal onClose={handleClose}>
        <div className={css.item}>
          <div className={css.header}>
            <h2>{note.title}</h2>
            <span className={css.tag}>{note.tag}</span>
          </div>
          <p className={css.content}>{note.content}</p>
          <p className={css.date}>
            Created: {new Date(note.createdAt).toLocaleDateString()}
          </p>
          <button onClick={handleClose} className={css.backBtn}>
            ← Back to notes
          </button>
        </div>
      </Modal>
    </div>
  );
}
