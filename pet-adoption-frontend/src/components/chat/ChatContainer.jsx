import React, { useEffect, useState } from "react";
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
import ChatBox from "./ChatBox";
import { useRouter } from "next/router";
import { Box, IconButton, Stack } from "@mui/material";
import { useChat } from "@/utils/contexts/chatContext";
import { useSelector } from "react-redux";
import chatService from "@/utils/services/chatService";

export default function ChatContainer(props) {
  const router = useRouter();
  const { isChatDialogOpen, openChatDialog, closeChatDialog } = useChat();
  const { getUnreadMessages } = chatService();
  const [unreadMessages, setUnreadMessages] = useState(null);
  const [loading, setLoading] = useState(true);
  const currentUserId = useSelector((state) => state.currentUser.currentUserId);

  useEffect(() => {
    closeChatDialog();
  }, [router]);

  useEffect(() => {
    if (currentUserId) {
      const fetchUnread = async () => {
        try {
          const result = await getUnreadMessages(currentUserId);
          if (result !== null) {
            if (result > 9) {
              setUnreadMessages("9+");
            } else {
              setUnreadMessages(result);
            }
            setLoading(false);
          }
        } catch (error) {
          console.error("Error fetching unread messages:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchUnread();
    }
  }, [currentUserId]);

  if (!isChatDialogOpen && !loading) {
    return (
      <Box
        sx={{
          position: "absolute",
          right: "3%",
          bottom: "5%",
          position: "fixed",
        }}
      >
        <IconButton
          color="primary"
          sx={{
            width: "80px",
            height: "80px",
          }}
          onClick={openChatDialog}
        >
          <ChatIcon sx={{ fontSize: "45px" }} />
          <div>
            {unreadMessages == "9+" || unreadMessages > 0 ? (
              <span className="icon-button__badge">{unreadMessages}</span>
            ) : (
              <></>
            )}
          </div>
        </IconButton>
      </Box>
    );
  }
  if (!loading) {
    return (
      <Stack
        direction="column"
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
        <IconButton
          color="primary"
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
}
