import React, { useState, useEffect } from "react";
import {
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
} from "@mui/material";
import Stomp from "stompjs";
import SockJS from "sockjs-client";

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [nickname, setNickname] = useState("");
  const [stompClient, setStompClient] = useState(null);

  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/ws");
    const client = Stomp.over(socket);

    client.connect(
      {},
      () => {
        console.log("Connected to WebSocket");
        client.subscribe("/topic/messages", (msg) => {
          const newMessage = JSON.parse(msg.body);
          console.log("Received message:", newMessage);
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        });
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
        sender: nickname,
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
        <TextField
          label="Nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
      </div>
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
