import React from 'react'
import ReactDOM from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { BrowserRouter } from 'react-router-dom'
import { SplineLoadProvider } from './components/splineLoadProvider'
import App from './App'
import './index.css'

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "1060221181168-tcqc0u99kb3kbnhjrburithdi5ga8cvo.apps.googleusercontent.com";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <BrowserRouter>
        <SplineLoadProvider>
          <App />
        </SplineLoadProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>
)
