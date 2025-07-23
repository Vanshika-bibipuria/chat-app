// src/pages/LoginPage.tsx
import { useState } from 'react';

interface Props {
  onLogin: (username: string) => void;
}

export default function LoginPage({ onLogin }: Props) {
  const [username, setUsername] = useState('');

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-80">
        <h2 className="text-2xl font-semibold mb-4 text-center">Login</h2>
        <input
          type="text"
          placeholder="Enter your name"
          className="border px-3 py-2 rounded w-full mb-4"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded w-full"
          onClick={() => username && onLogin(username)}
        >
          Join Chat
        </button>
      </div>
    </div>
  );
}
