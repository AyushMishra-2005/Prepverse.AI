import { useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthProvider.jsx'
import { QuizProvider } from './context/QuizContext.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google'

const CLIENT_ID = "373557072774-rrdq5hq418l7fp8jqkur0h4i10g15is8.apps.googleusercontent.com"



createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <AuthProvider>
        <QuizProvider>
          <App />
        </QuizProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  </BrowserRouter>,
)
