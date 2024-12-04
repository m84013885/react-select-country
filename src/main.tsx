import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App language='zh-HK' height={500} letterListHide={true} arrowHide={true} />
  </StrictMode>,
)
