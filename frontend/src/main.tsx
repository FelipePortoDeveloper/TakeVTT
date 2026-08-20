import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import GameTabletop from './containers/GameTabletop'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
   <GameTabletop />
  </StrictMode>
)
