import { createRoot } from 'react-dom/client'
import './styles/index.scss'
import App from './app/app.tsx'
import { Provider } from 'react-redux';
import { store } from './store/store';

createRoot(document.getElementById('root')!).render(
   <Provider store={store}>
      <App />
   </Provider>
)
