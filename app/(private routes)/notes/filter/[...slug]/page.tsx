import { Metadata } from "next";
import { fetchNotes } from "@/lib/api/serverApi";
import {
  HydrationBoundary,
  dehydrate,
  QueryClient,
} from "@tanstack/react-query";
import NotesClient from "./Notes.client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tag = slug[0];
  return {
    title: `Notes filtered by tag: ${tag}`,
    description: `List of notes filtered by tag ${tag}`,
  };
}

export default async function NotesFilterPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const tag = slug[0];
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", { tag }],
    queryFn: () => fetchNotes({ page: 1, perPage: 10, tag }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient />
    </HydrationBoundary>
  );
}
