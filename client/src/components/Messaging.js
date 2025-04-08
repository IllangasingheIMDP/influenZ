'use client';

import { useState, useEffect } from 'react';
import {
  getConversations,
  getMessages,
  sendMessage,
  getOrCreateConversation,
  getCurrentUser,
  searchUsers,
} from '../utils/api';

export default function Messaging({ onLogin, onSignup, user, setUser }) {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loginData, setLoginData] = useState({ email: '', password: '', role: 'influencer' });
  const [signupData, setSignupData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    contactInfo: '',
    role: 'influencer',
  });

  // Fetch current user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getCurrentUser();
        setUser(res.data);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };
    fetchUser();
  }, []);

  // Fetch conversations
  useEffect(() => {
    if (user) {
      const fetchConversations = async () => {
        try {
          const res = await getConversations();
          setConversations(res.data);
        } catch (error) {
          console.error('Error fetching conversations:', error);
        }
      };
      fetchConversations();
    }
  }, [user]);

  // Fetch messages when a conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      const fetchMessages = async () => {
        try {
          const res = await getMessages(selectedConversation.conversation_id);
          setMessages(res.data);
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      };
      fetchMessages();
    }
  }, [selectedConversation]);

  // Handle sending a message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage || !selectedConversation) return;

    try {
      const res = await sendMessage({
        conversationId: selectedConversation.conversation_id,
        recipientId:
          selectedConversation.user1_id === user.userId
            ? selectedConversation.user2_id
            : selectedConversation.user1_id,
        content: newMessage,
      });
      setMessages([...messages, res.data]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Handle starting a new conversation
  const handleStartConversation = async (otherUserId) => {
    try {
      const res = await getOrCreateConversation(otherUserId);
      setConversations([...conversations, res.data]);
      setSelectedConversation(res.data);
      setSearchQuery('');
      setSearchResults([]);
    } catch (error) {
      console.error('Error starting conversation:', error);
    }
  };

  // Handle search
  const handleSearch = async (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value) {
      try {
        const res = await searchUsers(e.target.value);
        setSearchResults(res.data);
      } catch (error) {
        console.error('Error searching users:', error);
      }
    } else {
      setSearchResults([]);
    }
  };

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await onLogin(loginData);
      setUser(res.data);
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  // Handle signup
  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await onSignup(signupData);
      alert('Signup successful! Please log in.');
    } catch (error) {
      console.error('Error signing up:', error);
    }
  };

  return (
    <div>
      {!user ? (
        <div style={{ display: 'flex', gap: '20px', padding: '20px' }}>
          {/* Login Form */}
          <div style={{ flex: 1 }}>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
              <div>
                <label>Email:</label>
                <input
                  type="email"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <label>Password:</label>
                <input
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  required
                />
              </div>
              <div>
                <label>Role:</label>
                <select
                  value={loginData.role}
                  onChange={(e) => setLoginData({ ...loginData, role: e.target.value })}
                >
                  <option value="influencer">Influencer</option>
                  <option value="brand">Brand</option>
                </select>
              </div>
              <button type="submit">Login</button>
            </form>
          </div>

          {/* Signup Form */}
          <div style={{ flex: 1 }}>
            <h2>Signup</h2>
            <form onSubmit={handleSignup}>
              <div>
                <label>Email:</label>
                <input
                  type="email"
                  value={signupData.email}
                  onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <label>Password:</label>
                <input
                  type="password"
                  value={signupData.password}
                  onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                  required
                />
              </div>
              <div>
                <label>First Name:</label>
                <input
                  type="text"
                  value={signupData.firstName}
                  onChange={(e) => setSignupData({ ...signupData, firstName: e.target.value })}
                  required
                />
              </div>
              <div>
                <label>Last Name:</label>
                <input
                  type="text"
                  value={signupData.lastName}
                  onChange={(e) => setSignupData({ ...signupData, lastName: e.target.value })}
                  required
                />
              </div>
              <div>
                <label>Contact Info:</label>
                <input
                  type="text"
                  value={signupData.contactInfo}
                  onChange={(e) => setSignupData({ ...signupData, contactInfo: e.target.value })}
                  required
                />
              </div>
              <div>
                <label>Role:</label>
                <select
                  value={signupData.role}
                  onChange={(e) => setSignupData({ ...signupData, role: e.target.value })}
                >
                  <option value="influencer">Influencer</option>
                  <option value="brand">Brand</option>
                </select>
              </div>
              <button type="submit">Signup</button>
            </form>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', height: '100vh' }}>
          {/* Sidebar: Conversations and Search */}
          <div style={{ width: '30%', borderRight: '1px solid #ccc', padding: '20px' }}>
            <h2>Welcome, {user?.name || 'User'}</h2>
            <button onClick={() => setUser(null)}>Logout</button>
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={handleSearch}
              style={{ width: '100%', marginBottom: '20px', padding: '5px' }}
            />
            {searchResults.length > 0 && (
              <div>
                <h3>Search Results</h3>
                {searchResults.map((result) => (
                  <div
                    key={result.user_id}
                    onClick={() => handleStartConversation(result.user_id)}
                    style={{ cursor: 'pointer', padding: '10px', borderBottom: '1px solid #eee' }}
                  >
                    {result.firstName} {result.lastName}
                  </div>
                ))}
              </div>
            )}
            <h3>Your Conversations</h3>
            {conversations.map((conv) => (
              <div
                key={conv.conversation_id}
                onClick={() => setSelectedConversation(conv)}
                style={{
                  cursor: 'pointer',
                  padding: '10px',
                  background:
                    selectedConversation?.conversation_id === conv.conversation_id
                      ? '#f0f0f0'
                      : 'white',
                }}
              >
                {conv.firstName} {conv.lastName}
              </div>
            ))}
          </div>

          {/* Chat Window */}
          <div style={{ width: '70%', padding: '20px' }}>
            {selectedConversation ? (
              <>
                <h3>
                  Chat with {selectedConversation.firstName} {selectedConversation.lastName}
                </h3>
                <div style={{ height: '70vh', overflowY: 'auto', border: '1px solid #ccc', padding: '10px' }}>
                  {messages.map((msg) => (
                    <div
                      key={msg.message_id}
                      style={{
                        textAlign: msg.sender_id === user.userId ? 'right' : 'left',
                        margin: '10px 0',
                      }}
                    >
                      <p>{msg.content}</p>
                      <small>{new Date(msg.created_at).toLocaleTimeString()}</small>
                    </div>
                  ))}
                </div>
                <form onSubmit={handleSendMessage} style={{ marginTop: '20px' }}>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    style={{ width: '80%', padding: '5px' }}
                  />
                  <button type="submit" style={{ padding: '5px 10px' }}>
                    Send
                  </button>
                </form>
              </>
            ) : (
              <p>Select a conversation to start chatting</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}