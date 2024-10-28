import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import {
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
} from "@mui/material";
import Stomp from "stompjs";
import SockJS from "sockjs-client";

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [stompClient, setStompClient] = useState(null);
  const isSubscribed = useRef(false);
  const currentUserName = useSelector(
    (state) => state.currentUser.currentUserFullName
  );

  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/ws");
    const client = Stomp.over(socket);

    client.connect(
      {},
      () => {
        console.log("Connected to WebSocket");
        // Check if already subscribed
        if (!isSubscribed.current) {
          client.subscribe("/topic/messages", (msg) => {
            const newMessage = JSON.parse(msg.body);
            console.log("Received message:", newMessage);
            setMessages((prevMessages) => [...prevMessages, newMessage]);
          });
          isSubscribed.current = true; // Mark as subscribed
          console.log("Subscription created");
        }
      },
      (error) => {
        console.error("WebSocket connection error:", error);
      }
    );

    setStompClient(client);

    // Cleanup function to disconnect the client
    return () => {
      if (client && client.connected) {
        console.log("Disconnecting WebSocket client");
        client.disconnect();
      }
    };
  }, []);

  const sendMessage = () => {
    if (stompClient && message.trim()) {
      const chatMessage = {
        sender: currentUserName,
        content: message,
      };
      console.log("Sending message:", chatMessage);
      stompClient.send("/app/chat", {}, JSON.stringify(chatMessage));
      setMessage("");
    }
  };

  return (
    <div>
      <div>
        <List>
          {messages.map((msg, index) => (
            <ListItem key={index}>
              <ListItemAvatar>
                <Avatar>{msg.sender[0]}</Avatar>
              </ListItemAvatar>
              <ListItemText primary={msg.sender} secondary={msg.content} />
            </ListItem>
          ))}
        </List>
      </div>
      <div>
        <TextField
          label="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <IconButton onClick={sendMessage} disabled={!message.trim()}>
          send
        </IconButton>
      </div>
    </div>
  );
};

export default ChatPage;
