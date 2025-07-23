import { useEffect, useState } from 'react';
import socket from '../socket';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import moment from 'moment';
import '../app.css';

interface Message {
  _id?: string;
  sender: string;
  text: string;
  timestamp?: string;
}

const ChatPage = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');
  const [undoStack, setUndoStack] = useState<Message[]>([]);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get('http://localhost:5050/api/messages');
        setMessages(res.data);
      } catch (err) {
        console.error('Error fetching messages:', err);
      }
    };

    fetchMessages();

    socket.on('receive-message', (msg: Message) => {
      setMessages((prev) => {
        if (prev.some((m) => m._id === msg._id)) return prev; // Avoid duplicates
        return [...prev, msg];
      });
    });

    return () => {
      socket.off('receive-message');
    };
  }, []);

  const sendMessage = async () => {
    if (!text.trim()) return;
    const payload = { sender: user.username, text };

    try {
      const res = await axios.post('http://localhost:5050/api/messages', payload);
      setMessages((prev) => [...prev, res.data]);
      socket.emit('send-message', res.data); // Real-time emit
      setText('');
    } catch (err) {
      console.error('Send failed:', err);
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    const msg = messages.find((m) => m._id === id);
    if (msg) {
      setUndoStack((prev) => [...prev, msg]);
      try {
        await axios.delete(`http://localhost:5050/api/messages/${id}`);
        setMessages((prev) => prev.filter((m) => m._id !== id));
      } catch (err) {
        console.error('Delete failed:', err);
      }
    }
  };

  const handleUndo = async () => {
    const last = undoStack.pop();
    if (!last) return;
    try {
      const res = await axios.post('http://localhost:5050/api/messages/restore', last);
      socket.emit('undo-message', res.data); // Real-time undo
      setUndoStack([...undoStack]);
    } catch (err) {
      console.error('Undo failed:', err);
    }
  };

  const handleArchive = async (id?: string) => {
    if (!id) return;
    try {
      await axios.post(`http://localhost:5050/api/messages/archive/${id}`);
      setMessages((prev) => prev.filter((m) => m._id !== id));
    } catch (err) {
      console.error('Archive failed:', err);
    }
  };

  return (
    <div className={`chat-container ${darkMode ? 'dark' : ''}`}>
      <div className="header">
        <h3>💬 Real-Time Chat</h3>
        <p>Hello, {user.username} 👋</p>
        <button onClick={() => setDarkMode((prev) => !prev)}>
          {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </div>

      <div className="messages">
        {messages.map((msg) => (
          <div key={msg._id || msg.text} className="message">
            <div>
              <strong>{msg.sender}</strong>: {msg.text}
            </div>
            <div className="meta">
              <span>{msg.timestamp ? moment(msg.timestamp).format('hh:mm A') : ''}</span>
              {msg.sender === user.username && (
                <>
                  <button onClick={() => handleDelete(msg._id)}>Delete</button>
                  <button onClick={() => handleArchive(msg._id)}>Archive</button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="input-area">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
        <button onClick={handleUndo}>Undo</button>
      </div>
    </div>
  );
};

export default ChatPage;
