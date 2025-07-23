import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

const LoginForm = () => {
  const { setUser } = useAuth();
  const [username, setUsername] = useState('');

  const handleLogin = async () => {
    try {
      const res = await API.post('/auth/login', { username });
      setUser(res.data.user);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter username" />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default LoginForm;
