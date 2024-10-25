import 'core-js'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import App from './App'
import { store } from './app/store'

const container = document.getElementById('root');

if(container){

  createRoot(container).render(
    <Provider store={store}>
      <App />
    </Provider>,
  )
}
