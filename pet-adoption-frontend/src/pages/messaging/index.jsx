import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import {
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Card,
  CardContent,
  Typography,
  Stack,
} from "@mui/material";
import Stomp from "stompjs";
import SockJS from "sockjs-client";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [stompClient, setStompClient] = useState(null);
  const isSubscribed = useRef(false);
  const currentUserName = useSelector(
    (state) => state.currentUser.currentUserFullName
  );
  const currentUserId = useSelector((state) => state.currentUser.currentUserId);

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
        senderID: currentUserId,
        content: message,
      };
      console.log("Sending message:", chatMessage);
      stompClient.send("/app/chat", {}, JSON.stringify(chatMessage));
      setMessage("");
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <Stack sx={{ paddingTop: 4 }} alignItems="center" gap={2}>
      <Card sx={{ width: "80%", position: "relative" }} elevation={4}>
        <CardContent>
          <Typography variant="h3" align="center">
            Messaging
          </Typography>
          <Typography variant="body1" align="center" color="text.secondary">
            Have fun in this silly little chat room!
          </Typography>
        </CardContent>
      </Card>
      <List
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          alignItems: "flex-start",
        }}
      >
        {messages.map((msg, index) => (
          <ListItem
            key={index}
            sx={{
              width: "100%",
              alignItems: "flex-start",
            }}
          >
            <ListItemAvatar>
              <Avatar
                src={`${apiUrl}/api/images/users/${msg.senderID}/profile`}
              ></Avatar>
            </ListItemAvatar>
            <ListItemText primary={msg.sender} secondary={msg.content} />
          </ListItem>
        ))}
      </List>
      <TextField
        label="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        autoComplete="off"
      />
      <Button
        onClick={sendMessage}
        disabled={!message.trim()}
        variant="contained"
      >
        send
      </Button>
    </Stack>
  );
};

export default ChatPage;
