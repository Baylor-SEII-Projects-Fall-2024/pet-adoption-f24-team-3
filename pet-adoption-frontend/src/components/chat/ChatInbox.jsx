import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  Typography,
  Avatar,
} from "@mui/material";
import { useChat } from "@/utils/contexts/chatContext";
import chatService from "@/utils/services/chatService";
import { useSelector } from "react-redux";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const truncateText = (text, maxLength) => {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + "...";
  }
  return text;
};

export default function ChatInbox() {
  const { openChat } = useChat();
  const { getChatInfoByUserId } = chatService();
  const [chats, setChats] = useState([]);
  const currentUserId = useSelector((state) => state.currentUser.currentUserId);

  const fetchChats = async () => {
    try {
      const userID = currentUserId; // Implement this function to get the current user's ID
      const chatInfoList = await getChatInfoByUserId({ userID });
      setChats((prevChats) => {
        return chatInfoList;
      });
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  const handleChatClick = (chatID) => {
    openChat(chatID);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Chat Inbox
      </Typography>
      <hr />
      {chats.length > 0 ? (
        <List>
          {chats.map((chat) => (
            <ListItem
              key={chat.chatID}
              divider
              sx={{
                padding: "0px",
                margin: "0",
              }}
            >
              <Button
                fullWidth
                onClick={() => handleChatClick(chat.chatID)}
                sx={{
                  justifyContent: "flex-start",
                  textAlign: "left",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: "15%",
                    mr: 3,
                  }}
                >
                  {/* Display senders avatar */}
                  <Avatar
                    sx={{
                      bgcolor: "#a3b18a",
                      width: 60,
                      height: 60,
                      border: "1px solid #000",
                    }}
                    alt="Sender Avatar"
                    src={`${apiUrl}/api/images/users/${chat.senderID}/profile`}
                  />
                </Box>
                <Box>
                  <ListItemText
                    primary={
                      <Typography variant="body1">{chat.senderName}</Typography>
                    }
                    secondary={
                      <>
                        {chat.hasUnread ? (
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: "bold" }}
                            color="textPrimary"
                          >
                            {truncateText(chat.mostRecentContent, 30)}
                          </Typography>
                        ) : (
                          <Typography variant="body2" color="textPrimary">
                            {truncateText(chat.mostRecentContent, 30)}
                          </Typography>
                        )}
                        <Typography variant="caption">
                          {new Date(chat.timestamp).toLocaleString()}
                        </Typography>
                      </>
                    }
                  />
                </Box>
              </Button>
            </ListItem>
          ))}
        </List>
      ) : (
        <>
          <br />
          <Typography variant="body1" align="center">
            No messages found
          </Typography>
        </>
      )}
    </Box>
  );
}
