// ChatContext.js
import React, { createContext, useContext, useState } from 'react';
import chatServices from "@/utils/services/chatServices";
const ChatContext = createContext();


//Note: DO NOT put all chat related functions here! This is JUST for the functions that potentially
// need to be called, and chat states that need to be observed, lots of places throughout the app.
export const ChatProvider = ({ children }) => {
    const [isChatDialogOpen, setIsChatDialogOpen] = useState(false);
    const [currentChatId, setCurrentChatId] = React.useState(null);
    const [currentChatPage, setCurrentChatPage] = React.useState("INBOX");
    const { getOrCreateChat } = chatServices();

    //opens the chat dialog with the specified user. Creates a chat if DNE
    const openChatByUser = async (senderID,receiverID) => {
        //TODO: CALL a service function to get or create a chat based on the other user's id

        await getOrCreateChat(senderID,receiverID)
        .then((result)=>{
            if(result != null){
                openChat(result.id);
            }else{
                console.error("ERROR fetching chat!");
            }
        })
        .catch((error)=>{
            console.error("Error creating or fetching chat:",error);

        }); // Async function wait for result

    };

    //opens the chat dialog, at its previous state
    const openChatDialog = () => {
        setIsChatDialogOpen(true);
    };
    //closes the chat dialog.
    const closeChatDialog = () => {
        setIsChatDialogOpen(false);
    };

    //opens the chat dialog (if closed) to the chat with the specified chat ID
    const openChat = (chatId) => {
        setCurrentChatId(chatId);
        console.log("Current chat ID:",chatId);
        setCurrentChatPage("CHAT");
        setIsChatDialogOpen(true);
    }
    //opens the chat dialog (if closed) to the inbox
    const openInbox = () => {
        setCurrentChatId(null);
        setCurrentChatPage("INBOX");
        setIsChatDialogOpen(true);
    }

    return (
        <ChatContext.Provider
            value={{
                isChatDialogOpen,
                currentChatId,
                currentChatPage,
                openChat,
                openChatByUser,
                openInbox,
                openChatDialog,
                closeChatDialog
            }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => useContext(ChatContext);