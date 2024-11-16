import { AppProviders } from './app-providers'
import { BrowserRouter } from 'react-router-dom'
import { AppRouter } from './router'

function App() {

   return (
      <AppProviders>
         <BrowserRouter>
            <AppRouter />
         </BrowserRouter>
      </AppProviders>
   )
}

export default App
