import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { ListTasksQuery, Task, User } from './types'

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL ?? 'http://localhost:3000',
  }),
  tagTypes: ['Task', 'User'],
  endpoints: (builder) => ({
    getTasks: builder.query<Task[], ListTasksQuery | void>({
      query: (params) => ({
        url: '/tasks',
        params: params ?? undefined,
      }),
      providesTags: ['Task'],
    }),
    getUsers: builder.query<User[], void>({
      query: () => '/users',
      providesTags: ['User'],
    }),
  }),
})

export const { useGetTasksQuery, useGetUsersQuery } = api
