import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

export function TestComponents() {
  return (
    <Box
      sx={{
        padding: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        maxWidth: 520,
        marginTop: 2
      }}
    >
      <Typography variant="h6" component="h2">
        Test MUI components
      </Typography>

      <Typography variant="body2" sx={{ opacity: 0.8 }}>
        If you see this text and the button reacts, MUI + Emotion are working.
      </Typography>

      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <Button variant="contained" onClick={() => console.log('MUI Button clicked')}>
          MUI Button
        </Button>
        <Button variant="outlined" onClick={() => console.log('MUI Outlined clicked')}>
          MUI Outlined
        </Button>
      </Box>
    </Box>
  )
}
