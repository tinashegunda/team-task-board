import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'

function App() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="h1">
            Team Task Board
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Typography color="text.secondary">
          Task list will go here.
        </Typography>
      </Container>
    </Box>
  )
}

export default App
