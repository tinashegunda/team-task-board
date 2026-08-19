import { useState } from 'react'
import Alert from '@mui/material/Alert'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
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
import { useGetTasksQuery, useGetUsersQuery } from '../store/api.ts'
import type { ListTasksQuery, TaskStatus } from '../store/types.ts'

const statusLabel: Record<TaskStatus, string> = {
  TODO: 'To do',
  IN_PROGRESS: 'In progress',
  DONE: 'Done',
}

export function TaskList() {
  const [status, setStatus] = useState<TaskStatus | ''>('')
  const [assigneeId, setAssigneeId] = useState('')
  const { data: users = [] } = useGetUsersQuery()

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
            <MenuItem value="TODO">{statusLabel.TODO}</MenuItem>
            <MenuItem value="IN_PROGRESS">{statusLabel.IN_PROGRESS}</MenuItem>
            <MenuItem value="DONE">{statusLabel.DONE}</MenuItem>
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
              </TableRow>
            </TableHead>
            <TableBody>
              {tasks?.length ? (
                tasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell>{task.title}</TableCell>
                    <TableCell>{task.description}</TableCell>
                    <TableCell>
                      <Chip size="small" label={statusLabel[task.status]} />
                    </TableCell>
                    <TableCell>{task.assignee.name}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4}>No tasks yet.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Stack>
  )
}
