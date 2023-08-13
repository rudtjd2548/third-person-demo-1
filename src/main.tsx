import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { store } from '@src/redux/store.ts'
import '@src/global.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <BrowserRouter>
      <React.Suspense fallback={''}>
        <App />
      </React.Suspense>
    </BrowserRouter>
  </Provider>,
)
