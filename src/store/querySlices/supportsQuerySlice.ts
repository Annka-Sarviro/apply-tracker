import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../fetchBaseQuery";
import { API_ROUTES } from "../api/api-routes";
import { Support } from "@/types/supports.types copy";

export const supportsQuerySlice = createApi({
  reducerPath: "supportsQuerySlice",

  baseQuery: baseQueryWithReauth,

  tagTypes: ["supports"],

  endpoints: (build) => ({
    createSupport: build.mutation<
      Support,
      Pick<Support, "email" | "name" | "text">
    >({
      query: (newSupport) => ({
        url: API_ROUTES.SUPPORTS,
        method: "POST",
        body: newSupport,
      }),
      invalidatesTags: ["supports"],
    }),

    getAllSupports: build.query<Support[], void>({
      query: () => "/supports",
      providesTags: ["supports"],
    }),

    getSupportById: build.query<Support, Pick<Support, "id">>({
      query: ({ id }) => `/supports/${id}`,
    }),

    updateSupportById: build.mutation<
      Support,
      Pick<Support, "id"> & Partial<Pick<Support, "email" | "name" | "text">>
    >({
      query: ({ id, ...updatedSupport }) => ({
        url: `${API_ROUTES.SUPPORTS}/${id}`,
        method: "PATCH",
        body: updatedSupport,
      }),
      invalidatesTags: ["supports"],
    }),

    deleteSupportById: build.mutation<void, string>({
      query: (id) => ({
        url: `${API_ROUTES.SUPPORTS}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["supports"],
    }),
  }),
});

export const {
  useCreateSupportMutation,
  useDeleteSupportByIdMutation,
  useGetAllSupportsQuery,
  useGetSupportByIdQuery,
  useUpdateSupportByIdMutation,
} = supportsQuerySlice;
