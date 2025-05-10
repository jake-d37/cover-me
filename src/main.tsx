import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Logo from './components/logo.tsx'
import App from './components/App.tsx'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Logo/>
        <App />
    </StrictMode>,
)
