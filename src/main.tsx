import { createRoot } from 'react-dom/client'
import './styles/index.scss'
import App from './app/app.tsx'

createRoot(document.getElementById('root')!).render(
   <App />
)
