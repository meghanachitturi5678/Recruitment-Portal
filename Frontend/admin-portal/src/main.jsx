import React from 'react'
import ReactDOM from 'react-dom/client'
import { ThemeProvider, createTheme } from '@mui/material';
import App from './App.jsx'
import './index.css'

const theme = createTheme({
  palette: {
    primary: {
      light: '#92d3c6',
      main: '#92d3c6',
      dark: '#92d3c6',
      contrastText: '#040b0a',
    },
    secondary: {
      light: '#98b2d5',
      main: '#98b2d5',
      dark: '#98b2d5',
      contrastText: '#040b0a',
    },
    accent: {
      light: '#7a8ac8',
      main: '#7a8ac8',
      dark: '#7a8ac8',
      contrastText: '#040b0a',
    },
    background: {
      default: '#f4fbf9',
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <App theme={theme} />
    </ThemeProvider>
  </React.StrictMode>,
)
