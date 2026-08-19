import { useState, type FormEvent } from 'react'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import { useCreateTaskMutation, useGetUsersQuery } from '../store/api.ts'

export function CreateTaskDialog() {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [assigneeId, setAssigneeId] = useState('')
  const { data: users = [] } = useGetUsersQuery()
  const [createTask, { isLoading, isError, reset: resetMutation }] =
    useCreateTaskMutation()

  const resetForm = () => {
    setTitle('')
    setDescription('')
    setAssigneeId('')
    resetMutation()
  }

  const handleClose = () => {
    if (isLoading) {
      return
    }
    setOpen(false)
    resetForm()
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    try {
      await createTask({
        title: title.trim(),
        description: description.trim() || undefined,
        assigneeId,
      }).unwrap()
      setOpen(false)
      resetForm()
    } catch {
      // Error state is shown via isError.
    }
  }

  return (
    <>
      <Button color="inherit" variant="outlined" onClick={() => setOpen(true)}>
        New task
      </Button>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <form onSubmit={handleSubmit}>
          <DialogTitle>New task</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              {isError ? (
                <Alert severity="error">Could not create the task.</Alert>
              ) : null}
              <TextField
                label="Title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                required
                autoFocus
                fullWidth
              />
              <TextField
                label="Description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                multiline
                minRows={2}
                fullWidth
              />
              <FormControl fullWidth required>
                <InputLabel id="create-assignee-label">Assignee</InputLabel>
                <Select
                  labelId="create-assignee-label"
                  label="Assignee"
                  value={assigneeId}
                  onChange={(event) => setAssigneeId(event.target.value)}
                >
                  {users.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isLoading || !title.trim() || !assigneeId}
            >
              Create
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  )
}
