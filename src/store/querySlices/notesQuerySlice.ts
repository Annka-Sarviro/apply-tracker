import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../fetchBaseQuery";
import { Note } from "../../types/notes.types";
import { API_ROUTES } from "../api/api-routes";

export const notesQuerySlice = createApi({
  baseQuery: baseQueryWithReauth,

  reducerPath: "notesQuerySlice",

  tagTypes: ["notes"],

  endpoints: (build) => ({
    createNote: build.mutation<
      Note,
      Pick<Note, "name"> & Partial<Pick<Note, "text">>
    >({
      query: (newNote) => ({
        url: API_ROUTES.NOTES,
        method: "POST",
        body: newNote,
      }),
      invalidatesTags: ["notes"],
    }),

    getAllNotes: build.query<Note[], void>({
      query: () => "/notes",
      providesTags: ["notes"],
    }),

    getNoteById: build.query<Note, Pick<Note, "id">>({
      query: ({ id }) => `/note/${id}`,
    }),

    updateNoteById: build.mutation<
      Note,
      Pick<Note, "id" | "name"> & Partial<Pick<Note, "text">>
    >({
      query: ({ id, ...updatedNote }) => ({
        url: `${API_ROUTES.NOTES}/${id}`,
        method: "PATCH",
        body: updatedNote,
      }),
      invalidatesTags: ["notes"],
    }),

    deleteNoteById: build.mutation<void, Pick<Note, "id">>({
      query: ({ id }) => ({
        url: `${API_ROUTES.NOTES}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["notes"],
    }),
  }),
});

export const {
  useCreateNoteMutation,
  useDeleteNoteByIdMutation,
  useGetAllNotesQuery,
  useGetNoteByIdQuery,
  useUpdateNoteByIdMutation,
} = notesQuerySlice;
