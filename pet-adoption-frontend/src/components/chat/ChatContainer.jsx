
import React, { useEffect, useState} from 'react';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import { Box, IconButton, Stack } from '@mui/material'
import ChatBox from './ChatBox';
import { useChat } from '@/utils/contexts/chatContext';

export default function ChatContainer(props) {
    const { isChatDialogOpen, openChatDialog, closeChatDialog } = useChat();
    const [unreadMessages, setUnreadMessages] = useState( 0 /* get unread message count (no service exists btw) */);
    useEffect(() => {
        setUnreadMessages(/* Still waiting on the service...*/)
    },[unreadMessages] )

    if (!isChatDialogOpen) {
        return (
            <Box
                sx={{
                    position: "absolute",
                    right: "3%",
                    bottom: "5%",
                    position: "fixed",
                }}
            >
                <IconButton color="primary"
                    sx={{
                        width: "80px",
                        height: "80px",
                    }}
                    onClick={openChatDialog}
                >
                    <ChatIcon sx={{ fontSize: "45px" }} />
                    <div>
                        {unreadMessages>0?
                        <span class="icon-button__badge">
                            {unreadMessages}
                        </span> : <></>}
                    </div>
                </IconButton>

            </Box>
        );
    }

    return (
        <Stack direction="column"
            sx={{
                position: "absolute",
                right: "3%",
                bottom: "5%",
                position: "fixed",
                alignItems: "flex-end",
                display: "flex",
                justifyContent: "flex-start",
            }}
        >
            <ChatBox />
            <IconButton color="primary"
                sx={{
                    width: "80px",
                    height: "80px",
                }}
                onClick={closeChatDialog}
            >
                <CloseIcon sx={{ fontSize: "45px" }} />
            </IconButton>

        </Stack>
    );


}