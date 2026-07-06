import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { NotificationProvider } from './contexts/NotificationContext.jsx';
import { DataProvider } from './contexts/DataContext.jsx';
import './index.css';

// Provider order matters: Auth is outermost because Data hydrates from the
// server based on the current user's role. Notification (toasts) is innermost
// so it can be used from any tree.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <NotificationProvider>
            <App />
          </NotificationProvider>
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
