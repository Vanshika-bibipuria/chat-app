import { useEffect, useState } from 'react';
import socket from '../socket';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './ChatPage.css'; // Make sure to create this CSS file

const ChatPage = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [typing, setTyping] = useState(false);
  const [someoneTyping, setSomeoneTyping] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // receive new message
    socket.on('receive-message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    // someone typing
    socket.on('user-typing', () => {
      setSomeoneTyping(true);
      setTimeout(() => setSomeoneTyping(false), 2000);
    });

    return () => {
      socket.off('receive-message');
      socket.off('user-typing');
    };
  }, []);

  const sendMessage = async () => {
    if (!text.trim()) return;

    const newMessage = {
      text,
      sender: user.username,
      avatar: user.avatar || '/default-avatar.png',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: true
    };

    socket.emit('send-message', newMessage);
    setMessages((prev) => [...prev, newMessage]);
    setText('');
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/messages/${id}`);
      setMessages((prev) => prev.filter((msg) => msg._id !== id));
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleArchive = async (id) => {
    try {
      await axios.post(`http://localhost:5000/api/messages/archive/${id}`);
      setMessages((prev) => prev.filter((msg) => msg._id !== id));
    } catch (err) {
      console.error('Archive failed:', err);
    }
  };

  const handleTyping = (e) => {
    setText(e.target.value);
    socket.emit('typing');
  };

  return (
    <div className={`chat-container ${darkMode ? 'dark' : ''}`}>
      <div className="chat-header">
        <h3>Hello, {user.username} 👋</h3>
        <button onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? '☀️ Light' : '🌙 Dark'}
        </button>
      </div>

      <div className="messages">
        {messages.map((msg, index) => (
          <div className="message" key={index}>
            <img src={msg.avatar || '/default-avatar.png'} alt="avatar" className="avatar" />
            <div className="msg-content">
              <div className="msg-top">
                <span className="sender">{msg.sender}</span>
                <span className="time">{msg.time}</span>
              </div>
              <p className="text">{msg.text} {msg.read ? '✓✓' : '✓'}</p>
              <div className="actions">
                <button onClick={() => handleDelete(msg._id)}>Delete</button>
                <button onClick={() => handleArchive(msg._id)}>Archive</button>
              </div>
            </div>
          </div>
        ))}
        {someoneTyping && <p className="typing-indicator">Someone is typing...</p>}
      </div>

      <div className="input-area">
        <input
          value={text}
          onChange={handleTyping}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatPage;
