import { CreateCyclePayload, Cycle } from "../types/cycle";
import { baseApi } from "./baseApi";

export const cycleApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getCycle: build.query<Cycle[], void>({
      query: (payload) => ({
        url: "/cycles",
        method: "GET",
        body: payload,
      }),
      providesTags: ["Cycle"],
    }),

    createCycle: build.mutation<
      { success: boolean; data: Cycle },
      CreateCyclePayload
    >({
      query: (payload) => ({
        url: "/admin/cycles",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Cycle"],
    }),
  }),
});

export const { useCreateCycleMutation, useGetCycleQuery } = cycleApi;
