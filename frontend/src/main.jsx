import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext.jsx'
import { BookingProvider } from './context/BookingContext.jsx'
import { AuditoriumProvider } from './context/AuditoriumContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <AuditoriumProvider>
        <BookingProvider>
          <App />
        </BookingProvider>
      </AuditoriumProvider>
    </AuthProvider>
  </React.StrictMode>,
)