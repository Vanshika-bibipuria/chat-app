import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import ChatPage from './pages/ChatPage';



const express = require('express');
const connectDB = require('./db'); // ✅ adjust path if needed

const app = express();
connectDB();

// your routes, middleware, etc.

app.listen(5050, () => {
  console.log('Server running on http://localhost:5050');
});


function App() {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={user ? <ChatPage /> : <LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
