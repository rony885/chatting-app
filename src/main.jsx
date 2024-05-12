import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import app from './firebaseConfig.js'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import store from './store.js'
import { Provider } from 'react-redux'



ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
    <ToastContainer position="top-center" />
    <Provider store={store}>
     <App />
    </Provider>
    </BrowserRouter>
  </React.StrictMode>,
)
