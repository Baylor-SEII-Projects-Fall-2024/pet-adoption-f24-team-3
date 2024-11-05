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
    const { getOrCreate, getChatInfoByUserID } = chatService();
    const [chats, setChats] = useState([]);
    const currentUserId = useSelector((state) => state.currentUser.currentUserId);

    useEffect(() => {
        fetchChats();
    }, []);

    const fetchChats = async () => {
        try {
            const userID = currentUserId; // Implement this function to get the current user's ID
            const chatInfoList = await getChatInfoByUserID({ userID });
            setChats(chatInfoList);
        } catch (error) {
            console.error("Error fetching chats:", error);
        }
    };

    const handleChatClick = (chatID) => {
        openChat(chatID);
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Chat Inbox
            </Typography>
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
                                primary={chat.otherUserName}
                                secondary={
                                    <>
                                        <Typography
                                            component="span"
                                            variant="body2"
                                            color="textPrimary"
                                        >
                                            {chat.lastMessage}
                                        </Typography>
                                        {" — " + new Date(chat.lastMessageTimestamp).toLocaleString()}
                                    </>
                                }
                            />
                        </Button>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
}

/*
export default function ChatInbox(props) {
    const { openChat } = useChat();
    const { getOrCreate, getChatInfoByUserID } = chatService();
    const [chats, setChats] = userState([]);

    useEffect(() => {
        fetchChats();
    }, []);

    const fetchChats = async() => {
        try {
            const userID = getCurrentUserID();
            const chatInfoList = await getChatInfoByUserID(userID);
            setChats(chatInfoList);
        } catch (error) {
            console.error("Error fetching chats:", error);
        }
    };

    const handleChatClick = (chatID) => {
        openChat(chatID);
    };

    return (
        <Box>
            <h1>
                Chat Inbox
            </h1>
            <hr />
            <br />
            {/*
            This is the chat inbox. It will list all of a user's chats, ordered
            with the most recent message at the top. It should look like the
            inbox on iMessage or whatever messaging app you use on your phone.
            *//*}
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
                                primary={char.otherUserName}
                                secondary={
                                    <>
                                        <Typography
                                            component="span"
                                            variant="body2"
                                            color="textPrimary"
                                        >
                                            {char.lastMessage}
                                        </Typography>
                                        {" - " + new Date(char.lastMessageTimestamp).toLocaleString()}
                                    </>
                                }
                            />
                        </Button>
                    </ListItem>
                ))}
            </List>

            <br />
        </Box>
    )
}
*/
