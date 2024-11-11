import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Box, Button, TextField, Typography, Stack } from "@mui/material";
import InfiniteScroll from "react-infinite-scroll-component";
import Stomp from "stompjs";
import SockJS from "sockjs-client";

import ChatMessage from "./ChatMessage";
import { useChat } from "@/utils/contexts/chatContext";
import userService from "@/utils/services/userService";
import chatService from "@/utils/services/chatService";

export default function ChatThread(props) {
  const { currentChatId, openInbox } = useChat();
  const currentUserId = useSelector((state) => state.currentUser.currentUserId);
  const currentUserFullName = useSelector(
    (state) => state.currentUser.currentUserFullName
  );

  const messagesEndRef = useRef(null);

  const { sendMessage, getChatByChatID, getMessagesByChatId } = chatService();
  const { getGenericUserInfo } = userService();
  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [recipient, setRecipient] = useState(null);

  /* This is the same as the messages page, unsure of the best way to refactor.
    It sets the stompClient which is necessary for connecting to the websocket and sending messages */
  const [stompClient, setStompClient] = useState(null);
  const isSubscribed = useRef(false);
  const [myMessage, setMyMessage] = useState("");

  async function getChat() {
    if (currentChatId == null) {
      console.error("Unable to retrieve chat: current chat id is null!");
      return;
    }
    await getChatByChatID(currentChatId)
      .then((result) => {
        if (result != null) {
          setChat(result);
          getRecipient(result);
        } else console.error("Error fetching chat!");
      })
      .catch((error) => {
        console.error("Error fetching chat:", error);
      });
  }

  async function getMessages() {
    if (currentChatId == null) {
      console.error("Unable to retrieve messages: current chat id is null!");
      return;
    }

    //Get the messages already sent in this chat
    await getMessagesByChatId({ currentChatId })
      .then((result) => {
        setMessages(result);
      })
      .catch((error) => {
        console.error("Error fetching chats:", error);
      });
  }
  async function getRecipient(currentChat) {
    if (!currentChat) {
      console.error("Unable to retrieve recipient: current chat is null!");
      return;
    }
    let recipientId = 0;
    if (currentChat.userIDFirst != currentUserId) {
      recipientId = currentChat.userIDFirst;
    } else {
      recipientId = currentChat.userIDSecond;
    }

    await getGenericUserInfo(recipientId)
      .then((result) => {
        if (result) {
          setRecipient(result);
        } else {
          console.error("Error fetching recipient user!");
        }
      })
      .catch((error) => {
        console.error("Error fetching recipient user:", error);
      });
  }

  async function recieveMessage(newMessage) {
    setMessages((prevMessages) => {
      let newMessages = [newMessage, ...prevMessages];
      return newMessages;
    });
  }

  useEffect(() => {
    if (!currentChatId) {
      openInbox(); //return to the inbox if there is no currentChatID
    }

    const socket = new SockJS("http://localhost:8080/ws");
    let client = Stomp.over(socket);

    async function setup() {
      await getChat();
      await getMessages();
    }

    async function establishConnection() {
      client.connect(
        {},
        () => {
          console.log("Connected to WebSocket");
          // Check if already subscribed
          if (!isSubscribed.current) {
            client.subscribe(`/topic/messages/${currentChatId}`, (msg) => {
              const newMessage = JSON.parse(msg.body);
              recieveMessage(newMessage);
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
    }
    setup();
    establishConnection();

    // Cleanup function to disconnect the client
    return () => {
      if (client && client.connected) {
        console.log("Disconnecting WebSocket client");
        client.disconnect();
      }
    };
  }, [currentChatId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMyMessage(value);
  };

  const handleContact = async (event) => {
    if (event.key == "Enter" && myMessage != "") {
      console.log("RecipientId", recipient.id);
      if (recipient.id == null) return;
      sendMessage(
        currentChatId,
        currentUserId,
        recipient.id,
        myMessage,
        stompClient
      );
      setMyMessage("");
    }
  };

  if (!chat || !recipient) {
    return;
  }

  return (
    <Box sx={{ height: "100%" }}>
      <Stack
        direction="row"
        sx={{
          height: "10%",
        }}
      >
        <Typography variant="h5" gutterBottom>
          {recipient.name}
        </Typography>
        <Button variant="outlined" onClick={openInbox}>
          Inbox
        </Button>
      </Stack>

      {/* Display chat messages */}
      <Box
        id="messageDiv"
        sx={{
          display: "flex",
          flexDirection: "column-reverse",
          maxHeight: "75%",
          overflowY: "scroll",
          border: "1px solid #ccc",
          borderRadius: "4px",
          padding: "10px",
          marginTop: "10px",
          marginBottom: "10px",
        }}
      >
        <InfiniteScroll
          dataLength={messages.length}
          //next={this.fetchMoreData}
          style={{ display: "flex", flexDirection: "column-reverse" }} //To put endMessage and loader to the top.
          inverse={true} //
          hasMore={false}
          loader={<p>Loading...</p>}
          scrollableTarget="messageDiv"
        >
          {messages.map((message, index) => (
            <ChatMessage
              key={index}
              message={message}
              isSender={message.senderID == currentUserId}
              senderName={
                message.senderID == currentUserId
                  ? currentUserFullName
                  : recipient.name
              }
            />
          ))}
        </InfiniteScroll>

        <div ref={messagesEndRef} />
      </Box>
      <TextField
        fullWidth
        onChange={handleChange}
        onKeyDown={handleContact}
        value={myMessage}
      ></TextField>
    </Box>
  );
}
