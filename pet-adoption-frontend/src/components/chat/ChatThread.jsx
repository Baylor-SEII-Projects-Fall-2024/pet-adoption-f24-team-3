import React from "react";
import { Box, Button, Link, TextField } from "@mui/material";
import { useChat, } from "@/utils/contexts/chatContext";
import { useSelector } from "react-redux";
import { useState, useEffect, useRef } from "react";
import Stomp from "stompjs";
import SockJS from "sockjs-client";
import chatServices from "@/utils/services/chatServices";
export default function ChatThread(props) {
    const { currentChatId, openInbox } = useChat();
    const { sendMessage, getByChatID } = chatServices();
    const currentUserId = useSelector((state) => state.currentUser.currentUserId); // get the current session user
    const [ chat, setChat ] = useState(null);
    const [ recipientId, setRecipientId] = useState(null);

    /* This is the same as the messages page, unsure of the best way to refactor.
    It sets the stompClient which is necessary for connecting to the websocket and sending messages */
    const [stompClient, setStompClient] = useState(null);
    const isSubscribed = useRef(false);
    const [myMessage, setMyMessage] = useState("");
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
            Chat with ID {currentChatId}
            <hr />
            This is an individual chat thread, where you will be able to send and
            recieve messages from a user. This is where all the websocket stuff
            should be established. Check out the
            <Link href="https://talkjs.com/" target="_blank"> Talk.js </Link> chat
            feature as a rough style guide. In the top left corner there should
            be an icon that returns the uer to their inbox.
            <br />
            <Button onClick={openInbox}>Return to Inbox</Button>
            <br></br>
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