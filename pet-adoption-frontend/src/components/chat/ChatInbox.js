import React from "react";
import { Box, Button } from "@mui/material";
import { useChat } from "@/utils/contexts/chatContext";

export default function ChatInbox(props) {
    const { openChat } = useChat();

    return (
        <Box>
            Chat inbox
            <hr />
            This is the chat inbox. It will list all of a user's chats, ordered
            with the most recent message at the top. It should look like the
            inbox on iMessage or whatever messaging app you use on your phone.
            <br />
            <Button onClick={() => { openChat(4) }}>Open example Chat with ID 4</Button>
        </Box>
    )
}