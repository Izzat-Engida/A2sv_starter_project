import { ChangeUserPassword, UpdateProfilePayload } from "../types/profile";
import { User } from "../types/users";

import { baseApi } from "./baseApi";

export const userApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getUserProfile: build.query<User, void>({
      query: (payload) => ({
        url: "/profile/me",
        method: "GET",
        body: payload,
      }),
      providesTags: ["Profile"],
    }),
    updateUser: build.mutation<
      User,
      { userId: string; payload: UpdateProfilePayload }
    >({
      query: (payload) => ({
        url: "/profile/me",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Profile"],
    }),
    changePassword: build.mutation<
      { success: boolean; data: null; message: string },
      ChangeUserPassword
    >({
      query: (payload) => ({
        url: "/profile/me/change-password",
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["Profile"],
    }),
  }),
});

export const {
  useChangePasswordMutation,
  useGetUserProfileQuery,
  useUpdateUserMutation,
} = userApi;
