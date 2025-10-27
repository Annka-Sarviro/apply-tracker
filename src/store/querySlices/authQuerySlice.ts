import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { baseQueryWithReauth } from "../fetchBaseQuery";
import {
  clearTokens,
  isLoggedIn,
  saveTokens,
} from "../slices/authSlice/authSlice";
import { closeModal, openModal } from "../slices/modalSlice/modalSlice";
import { API_ROUTES, BACKEND_ENDPOINTS } from "../api/api-routes";
import { profileQuerySlice } from "./profileQuerySlice";
import { vacanciesQuerySlice } from "./vacanciesQuerySlice";
import { resumesQuerySlices } from "./resumesQuerySlices";
import { projectQuerySlice } from "./projectQuerySlice";
import { coverLetterQuerySlice } from "./coverLettersQuerySlice";
import { notesQuerySlice } from "./notesQuerySlice";
import { supportsQuerySlice } from "./supportsQuerySlice";
import { eventQuerySlice } from "./eventsQuerySlice";
import { predictionsQuerySlice } from "./predictionsQuerySlice";
import { resetStore } from "../resetStore";

type AuthResponse = { access_token: string; refresh_token: string };
type AuthRequest = { email: string; password: string };
type ResponseMessage = { message: string; status_code: number };
type RequestChangePassword = {
  previous_password: string;
  new_password: string;
};

export const authPublicQuerySlice = createApi({
  reducerPath: "authPublicQuerySlice",

  baseQuery: fetchBaseQuery({
    baseUrl: BACKEND_ENDPOINTS.JOB_TRACKER_BACKEND,
  }),

  endpoints: (build) => ({
    logInUserWithCredentials: build.mutation<AuthResponse, AuthRequest>({
      query: (credentialUser) => ({
        url: API_ROUTES.AUTH.LOGIN,
        method: "POST",
        body: credentialUser,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          dispatch(saveTokens(data));

          dispatch(
            openModal({
              typeModal: "logInSuccess",
            })
          );

          dispatch(isLoggedIn());

          dispatch(profileQuerySlice.util.invalidateTags(["Profile"]));
        } catch {
          dispatch(
            openModal({
              typeModal: "logInError",
            })
          );
        }
      },
    }),

    registerUserWithCredentials: build.mutation<AuthResponse, AuthRequest>({
      query: (credentialUser) => ({
        url: API_ROUTES.AUTH.REGISTER,
        method: "POST",
        body: credentialUser,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(saveTokens(data));
          dispatch(
            openModal({
              typeModal: "signUpSuccess",
            })
          );

          dispatch(isLoggedIn());

          dispatch(profileQuerySlice.util.invalidateTags(["Profile"]));
        } catch {
          dispatch(
            openModal({
              typeModal: "signUpError",
            })
          );
        }
      },
    }),

    forgotPasswordUser: build.mutation<
      Pick<ResponseMessage, "message">,
      Pick<AuthRequest, "email">
    >({
      query: (emailUser) => ({
        url: API_ROUTES.AUTH.FORGOT_PASSWORD,
        method: "POST",
        body: emailUser,
      }),
    }),

    resetUserPassword: build.mutation<
      Pick<ResponseMessage, "message">,
      Pick<AuthRequest, "password"> & { token: string }
    >({
      query: (requestBody) => ({
        url: API_ROUTES.AUTH.RESET_PASSWORD,
        method: "POST",
        body: requestBody,
      }),
    }),

    refreshToken: build.mutation<
      Pick<AuthResponse, "access_token">,
      Pick<AuthResponse, "refresh_token">
    >({
      query: (requestBody) => ({
        url: API_ROUTES.AUTH.REFRESH,
        method: "POST",
        body: requestBody,
      }),
    }),
  }),
});

export const authPrivateQuerySlice = createApi({
  reducerPath: "authPrivateQuerySlice",

  baseQuery: baseQueryWithReauth,

  endpoints: (build) => ({
    logOutUser: build.mutation<ResponseMessage, void>({
      query: () => ({
        url: API_ROUTES.AUTH.LOGOUT,
        method: "POST",
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(clearTokens());
          localStorage.removeItem("persist:auth");

          dispatch(resetStore());

          dispatch(authPrivateQuerySlice.util.resetApiState());
          dispatch(authPublicQuerySlice.util.resetApiState());
          dispatch(profileQuerySlice.util.resetApiState());
          dispatch(vacanciesQuerySlice.util.resetApiState());
          dispatch(resumesQuerySlices.util.resetApiState());
          dispatch(projectQuerySlice.util.resetApiState());
          dispatch(coverLetterQuerySlice.util.resetApiState());
          dispatch(notesQuerySlice.util.resetApiState());
          dispatch(supportsQuerySlice.util.resetApiState());
          dispatch(eventQuerySlice.util.resetApiState());
          dispatch(predictionsQuerySlice.util.resetApiState());

          dispatch(closeModal());
        } catch {
          dispatch(
            openModal({
              typeModal: "logInError",
            })
          );
        }
      },
    }),

    changePasswordUser: build.mutation<void, RequestChangePassword>({
      query: (requestBody) => ({
        url: API_ROUTES.USER.CHANGE_PASSWORD,
        method: "POST",
        body: requestBody,
      }),
    }),

    removeUser: build.mutation<void, { userId: string }>({
      query: (body) => ({
        url: "/user",
        method: "DELETE",
        body,
      }),
    }),
  }),
});

export const {
  useLogInUserWithCredentialsMutation,
  useRegisterUserWithCredentialsMutation,
  useForgotPasswordUserMutation,
  useRefreshTokenMutation,
  useResetUserPasswordMutation,
} = authPublicQuerySlice;

export const {
  useLogOutUserMutation,
  useChangePasswordUserMutation,
  useRemoveUserMutation,
} = authPrivateQuerySlice;
