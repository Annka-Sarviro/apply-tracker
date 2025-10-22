import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../fetchBaseQuery";
import { CoverLetter } from "../../types/coverLetters.types";
import { API_ROUTES } from "../api/api-routes";

export const coverLetterQuerySlice = createApi({
  reducerPath: "coverLetterQuerySlice",

  baseQuery: baseQueryWithReauth,

  tagTypes: ["coverLetter"],

  endpoints: (build) => ({
    createCoverLetter: build.mutation<
      CoverLetter,
      Pick<CoverLetter, "name" | "text">
    >({
      query: (coverLetter) => ({
        url: API_ROUTES.COVER_LETTER,
        method: "POST",
        body: coverLetter,
      }),
      invalidatesTags: ["coverLetter"],
    }),

    getAllCoverLetters: build.query<CoverLetter[], void>({
      query: () => "/cover-letter",
      providesTags: ["coverLetter"],
    }),

    getCoverLetterById: build.query<CoverLetter, Pick<CoverLetter, "id">>({
      query: ({ id }) => `/cover-letter/${id}`,
    }),

    updateCoverLetterById: build.mutation<
      CoverLetter,
      Pick<CoverLetter, "id"> & Partial<Pick<CoverLetter, "name" | "text">>
    >({
      query: ({ id, ...updatedCovetLetter }) => ({
        url: `${API_ROUTES.COVER_LETTER}/${id}`,
        method: "PATCH",
        body: updatedCovetLetter,
      }),
      invalidatesTags: ["coverLetter"],
    }),

    deleteCoverLetterById: build.mutation<void, Pick<CoverLetter, "id">>({
      query: ({ id }) => ({
        url: `${API_ROUTES.COVER_LETTER}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["coverLetter"],
    }),
  }),
});

export const {
  useCreateCoverLetterMutation,
  useDeleteCoverLetterByIdMutation,
  useGetAllCoverLettersQuery,
  useGetCoverLetterByIdQuery,
  useUpdateCoverLetterByIdMutation,
} = coverLetterQuerySlice;
