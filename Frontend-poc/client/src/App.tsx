import AuthProvider from './contexts/AuthContext'
import { ColorScheme, ColorSchemeProvider, MantineProvider, Paper, Transition } from '@mantine/core'
import Dashboard from './components/Dashboard/Dashboard'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './components/Login/login'
import Register from './components/Login/register'
import { useState } from 'react'
import { Notifications } from '@mantine/notifications'
import CustomersTable from './components/CustomersTable/CustomersTable'
import { CustomerProvider } from './contexts/CustomerContext'

function App() {
  const [colorScheme, setColorScheme] = useState<ColorScheme>('light');
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));
  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider theme={{ colorScheme }} withGlobalStyles withNormalizeCSS>
        <Notifications />
        <AuthProvider>
          <CustomerProvider>
            <BrowserRouter>
              <Paper>
                <Routes>
                  <Route path='/' element={<Login />} />
                  <Route path='/register' element={<Register />} />
                  <Route path='/customers' element={<CustomersTable />} />
                  <Route path='/dashboard/*' element={<Dashboard />} />
                </Routes>
              </Paper>
            </BrowserRouter>
          </CustomerProvider>
        </AuthProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  )
}

export default App
