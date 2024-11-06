import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    List,
    ListItem,
    ListItemText,
    Typography
} from "@mui/material";
import { useChat } from "@/utils/contexts/chatContext";
import chatService from "@/utils/services/chatService";
import { useSelector } from 'react-redux';

export default function ChatInbox() {
    const { openChat } = useChat();
    const { getChatInfoByUserId } = chatService();
    const [chats, setChats] = useState([]);
    const currentUserId = useSelector((state) => state.currentUser.currentUserId);

    const fetchChats = async () => {
        try {
            const userID = currentUserId; // Implement this function to get the current user's ID
            const chatInfoList = await getChatInfoByUserId({ userID });
            setChats(prevChats => {
                return chatInfoList;
            });
        } catch (error) {
            console.error("Error fetching chats:", error);
        }
    };

    useEffect(() => {
        fetchChats();
    }, [fetchChats]);

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
                    >
                        <Button
                            fullWidth
                            onClick={() => handleChatClick(chat.chatID)}
                            sx={{ justifyContent: 'flex-start', textAlign: 'left' }}
                        >
                            <ListItemText
                                primary={chat.senderID}
                                secondary={
                                    <>
                                        <Typography
                                            component="span"
                                            variant="body2"
                                            color="textPrimary"
                                        >
                                            {chat.lastMessage}
                                        </Typography>
                                        {new Date(chat.timestamp).toLocaleString()}
                                    </>
                                }
                            />
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
