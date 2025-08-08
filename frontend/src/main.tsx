import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import '../src/router/Index.tsx'
import { UserProvider } from './context/UserContext.tsx' // 👈 asegúrate que esta ruta sea correcta
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UserProvider> {/* envolvemos toda la app */}
      <App />
    </UserProvider>
  </StrictMode>,
)