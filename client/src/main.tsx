import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider value={{ user: { username: 'vanshika' } }}>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
