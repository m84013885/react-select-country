import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import App from './App.tsx'
import ReactSelectCountry from 'react-select-country-mw'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* <App language='zh-HK' height={500} letterListHide={true} arrowHide={true} /> */}
    <ReactSelectCountry language='zh-CN' />
  </StrictMode>
)
