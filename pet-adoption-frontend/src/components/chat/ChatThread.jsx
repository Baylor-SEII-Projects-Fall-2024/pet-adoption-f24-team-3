import React, { useState, useEffect, useRef } from "react";
import {
    Box,
    Button,
    Link,
    TextField,
    Typography
} from "@mui/material";
import { useChat } from "@/utils/contexts/chatContext";
import chatService from "@/utils/services/chatService";
import { useSelector } from 'react-redux';
import Stomp from "stompjs";
import SockJS from "sockjs-client";

export default function ChatThread(props) {
    const { currentChatId, openInbox } = useChat();
    const { getChatByChatId } = chatService();
    const currentUserId = useSelector((state) => state.currentUser.currentUserId);
    const messagesEndRef = useRef(null);

    const { sendMessage, getByChatID } = chatServices();
    const [ chat, setChat ] = useState(null);
    const [ recipientId, setRecipientId] = useState(null);

    /* This is the same as the messages page, unsure of the best way to refactor.
    It sets the stompClient which is necessary for connecting to the websocket and sending messages */
    const [stompClient, setStompClient] = useState(null);
    const isSubscribed = useRef(false);
    const [myMessage, setMyMessage] = useState("");

    const fetchChat = async () => {
        if (!currentChatId) {
            openInbox; // I don't know if this does what I think it'll do -Icko
        };

        try {
            const chatInfo = await getChatByChatId({ currentChatId });
            setChat(prevChats => {
                return chatInfo;
            });
        } catch (error) {
            console.error("Error fetching chats:", error);
        }
    };

    useEffect(() => {
        fetchChat();
    }, [fetchChat]);

    const otherUserId = chat.length > 0
        ? (chat[0].senderID === currentUserId ? chat[0].recipientID : chat[0].senderID)
        : null;

    useEffect(() => {
        const socket = new SockJS("http://localhost:8080/ws");
        const client = Stomp.over(socket);
        async function establishConnection(){
            if(currentChatId == null) return;
            await getByChatID(currentChatId)
            .then((result)=>{
                if(result!=null){
                    console.log("GET CHAT:",result);
                    setChat(result);
                    if(result.userIDFirst !== currentUserId){
                        setRecipientId(result.userIDFirst);
                    }else{
                        setRecipientId(result.userIDSecond);
                    }
                    
                }
                else console.error("Error fetching chat!");
            })
            .catch((error)=>{
                console.error("Error fetching chat:",error);
            })
            
            client.connect(
            {},
            () => {
                console.log("Connected to WebSocket");
                // Check if already subscribed
                if (!isSubscribed.current) {
                client.subscribe(`/topic/messages/${currentChatId}`, (msg) => {
                    const newMessage = JSON.parse(msg.body);
                    console.log("Received message:", newMessage);
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
        setMyMessage(value)
    };

    const handleContact = async (event) => {
        if(event.key == "Enter" && myMessage != "" ){
            /* currentChatID is used as the contacteeID, I believe this will change later.
            However, this currently prevents DMs from showing up in global messages*/
            console.log("RECipientID",recipientId);
            if(recipientId == null) return;

            sendMessage(currentChatId, currentUserId, recipientId, myMessage, stompClient);
            setMyMessage("");
        } 
    }
    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                {/* TODO: get recepient user based on chatId -Icko */}
                Chatting With {otherUserId}
            </Typography>
            {/*
            This is an individual chat thread, where you will be able to send and
            recieve messages from a user. This is where all the websocket stuff
            should be established. Check out the
            <Link href="https://talkjs.com/" target="_blank"> Talk.js </Link> chat
            feature as a rough style guide. In the top left corner there should
            be an icon that returns the uer to their inbox.
            */}
            <Button
                variant="outlined"
                onClick={openInbox}>Return to Inbox
            </Button>
            {/* Display chat messages */}
            <Box
                sx={{
                    height: '400px',
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

            {/* <form onsubmit={handleContact}> */}
                <TextField
                fullWidth
                onChange={handleChange}
                onKeyDown={handleContact}
                value={myMessage}>
                </TextField>
            {/* </form> */}
        </Box>
    )
}
