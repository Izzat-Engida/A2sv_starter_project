import {
  CreateUserPayload,
  DeleteUserPayload,
  UpdateUserPayload,
  User,
} from "../types/users";
import { baseApi } from "./baseApi";

export const userApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getusers: build.query<User[], void>({
      query: (payload) => ({
        url: "/admin/users",
        method: "GET",
        body: payload,
      }),
      providesTags: ["User"],
    }),
    getUsersById: build.query<User, string>({
      query: (userId) => ({
        url: `/admin/users/${userId}`,
        method: "GET",
      }),
      providesTags: ["User"],
    }),
    createUser: build.mutation<
      { success: boolean; data: User },
      CreateUserPayload
    >({
      query: (payload) => ({
        url: "/admin/users",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["User"],
    }),
    updateUser: build.mutation<
      User,
      { userId: string; payload: UpdateUserPayload }
    >({
      query: ({ userId, payload }) => ({
        url: `/admin/users/${userId}`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["User"],
    }),
    deleteUser: build.mutation<
      User,
      { userId: string; payload: DeleteUserPayload }
    >({
      query: ({ userId, payload }) => ({
        url: `/admin/users/${userId}`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetusersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApi;
