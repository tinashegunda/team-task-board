import { useState } from 'react'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Select from '@mui/material/Select'
import Stack from '@mui/material/Stack'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { useDeleteTaskMutation, useGetTasksQuery, useGetUsersQuery, useUpdateTaskStatusMutation } from '../store/api.ts'
import type { ListTasksQuery, Task, TaskStatus } from '../store/types.ts'

const statuses: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'DONE']

const statusLabel: Record<TaskStatus, string> = {
  TODO: 'To do',
  IN_PROGRESS: 'In progress',
  DONE: 'Done',
}

export function TaskList() {
  const [status, setStatus] = useState<TaskStatus | ''>('')
  const [assigneeId, setAssigneeId] = useState('')
  const { data: users = [] } = useGetUsersQuery()
  const [updateTaskStatus] = useUpdateTaskStatusMutation()
  const [deleteTask] = useDeleteTaskMutation()
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null)

  const query: ListTasksQuery = {
    ...(status ? { status } : {}),
    ...(assigneeId ? { assigneeId } : {}),
  }
  const { data: tasks, isLoading, isError } = useGetTasksQuery(
    Object.keys(query).length ? query : undefined,
  )

  return (
    <Stack spacing={2}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel id="status-filter-label">Status</InputLabel>
          <Select
            labelId="status-filter-label"
            label="Status"
            value={status}
            onChange={(event) =>
              setStatus(event.target.value as TaskStatus | '')
            }
          >
            <MenuItem value="">All</MenuItem>
            {statuses.map((value) => (
              <MenuItem key={value} value={value}>
                {statusLabel[value]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 220 }}>
          <InputLabel id="assignee-filter-label">Assignee</InputLabel>
          <Select
            labelId="assignee-filter-label"
            label="Assignee"
            value={assigneeId}
            onChange={(event) => setAssigneeId(event.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            {users.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                {user.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      {isLoading ? (
        <CircularProgress aria-label="Loading tasks" />
      ) : isError ? (
        <Alert severity="error">Could not load tasks.</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Assignee</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tasks?.length ? (
                tasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell>{task.title}</TableCell>
                    <TableCell>{task.description}</TableCell>
                    <TableCell>
                      <Select
                        size="small"
                        value={task.status}
                        onChange={(event) => {
                          void updateTaskStatus({
                            id: task.id,
                            status: event.target.value as TaskStatus,
                          })
                        }}
                        inputProps={{ 'aria-label': `Status for ${task.title}` }}
                      >
                        {statuses.map((value) => (
                          <MenuItem key={value} value={value}>
                            {statusLabel[value]}
                          </MenuItem>
                        ))}
                      </Select>
                    </TableCell>
                    <TableCell>{task.assignee.name}</TableCell>
                    <TableCell>
                      <Button
                        type="button"
                        size="small"
                        color="error"
                        onClick={() => setTaskToDelete(task)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5}>No tasks yet.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog
        open={taskToDelete !== null}
        onClose={() => setTaskToDelete(null)}
        aria-labelledby="delete-task-title"
      >
        <DialogTitle id="delete-task-title">Delete task?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Delete “{taskToDelete?.title}”? This cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button type="button" onClick={() => setTaskToDelete(null)}>
            Cancel
          </Button>
          <Button
            type="button"
            color="error"
            variant="contained"
            onClick={() => {
              if (!taskToDelete) {
                return
              }
              void deleteTask(taskToDelete.id)
              setTaskToDelete(null)
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  )
}
