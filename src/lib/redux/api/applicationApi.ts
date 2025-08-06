import { DecideApplication } from "../types/application";

import { baseApi } from "./baseApi";

export const userApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    decideApplication: build.mutation<
      { success: boolean },
      { id: string; payload: DecideApplication }
    >({
      query: ({ id, payload }) => ({
        url: `manager/applications/${id}/decide`,
        method: "PATCH",
        body: payload,
      }),
    }),
  }),
});

export const { useDecideApplicationMutation } = userApi;
