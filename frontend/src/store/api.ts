import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type {
  CreateTaskPayload,
  ListTasksQuery,
  Task,
  UpdateTaskStatusPayload,
  User,
} from './types'

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
    createTask: builder.mutation<Task, CreateTaskPayload>({
      query: (body) => ({
        url: '/tasks',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Task'],
    }),
    updateTaskStatus: builder.mutation<Task, UpdateTaskStatusPayload>({
      query: ({ id, status }) => ({
        url: `/tasks/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['Task'],
    }),
    deleteTask: builder.mutation<void, string>({
      query: (id) => ({
        url: `/tasks/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Task'],
    }),
  }),
})

export const {
  useGetTasksQuery,
  useGetUsersQuery,
  useCreateTaskMutation,
  useUpdateTaskStatusMutation,
  useDeleteTaskMutation,
} = api
