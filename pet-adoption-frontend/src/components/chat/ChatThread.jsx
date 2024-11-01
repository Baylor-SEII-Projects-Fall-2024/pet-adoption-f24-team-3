import React from "react";
import { Box, Button, Link } from "@mui/material";
import { useChat } from "@/utils/contexts/chatContext";

export default function ChatThread(props) {
    const { currentChatId, openInbox } = useChat();

    return (
        <Box>
            Chat with ID {currentChatId}
            <hr />
            This is an individual chat thread, where you will be able to send and
            recieve messages from a user. This is where all the websocket stuff
            should be established. View the
            <Link href="https://talkjs.com/" target="_blank"> Talk.js </Link> chat feature as a style guide
            for how to do this. In the top left corner there should be an icon that
            returns the uer to their inbox.
            <br />
            <Button onClick={openInbox}>Return to Inbox</Button>
        </Box>
    )
}