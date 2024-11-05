import React, { useState, useEffect, useCallback, useRef } from "react";
import { Box, Button, Link } from "@mui/material";
import { useChat } from "@/utils/contexts/chatContext";
import chatService from "@/utils/services/chatService";
import { useSelector } from 'react-redux';

export default function ChatThread(props) {
    const { currentChatId, openInbox } = useChat();
    const { getChatByChatId } = chatService();
    const [ chat, setChat ] = useState([]);
    const currentUserId = useSelector((state) => state.currentUser.currentUserId);
    const messagesEndRef = useRef(null);

    const fetchChat = useCallback(async () => {
        if (!currentChatId) {
            openInbox;
        };

        try {
            const chatInfo = await getChatByChatId({ currentChatId });
            setChat(prevChats => {
                return chatInfo;
            });
        } catch (error) {
            console.error("Error fetching chats:", error);
        }
    });

    useEffect(() => {
        fetchChat();
    }, [fetchChat]);

    return (
        <Box>
            Chat with ID {currentChatId}
            <br />
            <hr />
            {/*
            This is an individual chat thread, where you will be able to send and
            recieve messages from a user. This is where all the websocket stuff
            should be established. Check out the
            <Link href="https://talkjs.com/" target="_blank"> Talk.js </Link> chat
            feature as a rough style guide. In the top left corner there should
            be an icon that returns the uer to their inbox.
            */}
            <br />
            <Button onClick={openInbox}>Return to Inbox</Button>
            <hr />
            <br />
            {/* Display chat messages */}
                        <Box 
                sx={{
                    height: '400px', // Adjust this value as needed
                    overflowY: 'auto',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    padding: '10px',
                    marginTop: '10px',
                    marginBottom: '10px'
                }}
            >
                {chat.map((message) => (
                    <Box 
                        key={message.messageID} 
                        sx={{
                            marginBottom: '10px',
                            padding: '5px',
                            backgroundColor: message.senderID === currentUserId ? '#e6f7ff' : '#f0f0f0',
                            borderRadius: '4px'
                        }}
                    >
                        <strong>
                            {message.senderID === currentUserId ? 'You' : `User ${message.senderID}`}:
                        </strong>
                        <p>{message.content}</p>
                    </Box>
                ))}
                <div ref={messagesEndRef} />
            </Box>
            {/* TODO: add input field -Icko */}
        </Box>
    )
}
