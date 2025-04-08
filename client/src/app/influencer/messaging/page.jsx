"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import api from "@/utils/api";
import styles from "./Messages.module.css";

const MessagesPage = () => {
  const { userId, role } = useSelector((state) => state.user);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    if (userId) {
      fetchConversations();
    }
  }, [userId]);

  const fetchConversations = async () => {
    try {
      const response = await api.get()
      setConversations(response.data);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      const response = await api.get(
        `/messages/${conversationId}`
      );
      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleConversationClick = (conversation) => {
    setSelectedConversation(conversation);
    fetchMessages(conversation.conversation_id);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage || !selectedConversation) return;

    try {
      const response = await api.post(
        "messages",
      );
      setMessages([...messages, response.data]);
      setNewMessage("");
      fetchConversations();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await api.get(
        `/user/search?query=${searchQuery}`
      );
      setSearchResults(response.data);
    } catch (error) {
      console.error("Error searching users:", error);
    }
  };

  const startConversation = async (otherUserId) => {
    try {
      const response = await api.post(
        "/conversations",
      );
      setSelectedConversation(response.data);
      fetchMessages(response.data.conversation_id);
      fetchConversations();
      setSearchQuery("");
      setSearchResults([]);
    } catch (error) {
      console.error("Error starting conversation:", error);
    }
  };

  // Rest of the component remains unchanged...
  if (!userId) {
    return <p>Please log in to view messages.</p>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <h2>Conversations</h2>
        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
        />
        {searchResults.length > 0 && (
          <ul className={styles.searchResults}>
            {searchResults.map((user) => (
              <li
                key={user.user_id}
                onClick={() => startConversation(user.user_id)}
              >
                {user.firstName} {user.lastName} ({user.user_type})
              </li>
            ))}
          </ul>
        )}
        <ul className={styles.conversationList}>
          {conversations.map((conv) => (
            <li
              key={conv.conversation_id}
              onClick={() => handleConversationClick(conv)}
              className={
                selectedConversation?.conversation_id === conv.conversation_id
                  ? styles.active
                  : ""
              }
            >
              {conv.firstName} {conv.lastName} ({conv.user_type})
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.chat}>
        {selectedConversation ? (
          <>
            <h3>
              Chat with {selectedConversation.firstName}{" "}
              {selectedConversation.lastName}
            </h3>
            <div className={styles.messages}>
              {messages.map((msg) => (
                <div
                  key={msg.message_id}
                  className={
                    msg.sender_id === userId ? styles.sent : styles.received
                  }
                >
                  <p>{msg.content}</p>
                  <small>{new Date(msg.created_at).toLocaleString()}</small>
                </div>
              ))}
            </div>
            <form onSubmit={handleSendMessage} className={styles.messageForm}>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
              />
              <button type="submit">Send</button>
            </form>
          </>
        ) : (
          <p>Select a conversation to start chatting.</p>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;