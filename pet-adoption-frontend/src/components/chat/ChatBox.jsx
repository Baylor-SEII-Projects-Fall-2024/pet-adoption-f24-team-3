import React from "react";
import { Box } from "@mui/material";
import ChatInbox from "./ChatInbox";
import ChatThread from "./ChatThread";
import { useChat } from "@/utils/contexts/chatContext";

export default function ChatBox(props) {
    const { currentChatId, currentChatPage, openChat, openInbox } = useChat();

    return (
        <Box
            sx={{
                backgroundColor: "white",
                width: "30vw",
                height: "70vh",
                borderRadius: 2,
                boxShadow: 4,
                overflow: "hidden",
                border: "4px grey"
            }}
        >
            {currentChatPage == "INBOX" &&
                <ChatInbox openChat={openChat} />

            }
            {currentChatPage == "CHAT" && currentChatId != null &&
                <ChatThread openInbox={openInbox} chatId={currentChatId} />
            }

        </Box>
    );
}