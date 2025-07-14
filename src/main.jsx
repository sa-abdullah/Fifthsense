import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './client/pages/App.jsx'
import AuthPage from './client/pages/authpage.jsx'
import  Dashboard from './client/pages/dashboard.jsx'
import { GlobalContextProvider } from './client/components/global.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GlobalContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<App/>}/>
          <Route path='/auth' element={<AuthPage/>}/>
          <Route path='/dashboard' element={<Dashboard/>}/>
        </Routes>
      </BrowserRouter>
    </GlobalContextProvider>
  </StrictMode>
)
