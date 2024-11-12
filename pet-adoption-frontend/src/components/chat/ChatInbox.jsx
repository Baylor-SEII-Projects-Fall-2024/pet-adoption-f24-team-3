import React, { useState, useEffect } from "react";
import { Box, Button, List, ListItem, Typography, Avatar } from "@mui/material";
import { useChat } from "@/utils/contexts/chatContext";
import chatService from "@/utils/services/chatService";
import { useSelector } from "react-redux";
import InfiniteScroll from "react-infinite-scroll-component";
import Loading from "@/components/Loading";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const truncateText = (text, maxLength) => {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + "...";
  }
  return text;
};

export default function ChatInbox() {
  const { openChat } = useChat();
  const { getChatInfoByUserId } = chatService();
  const currentUserId = useSelector((state) => state.currentUser.currentUserId);

  const [chatData, setChatData] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [hasMore, setHasMore] = React.useState(true);
  const quantityPerPage = 6;

  useEffect(() => {
    async function load() {
      await getChatInfoByUserId(currentUserId, quantityPerPage, 0)
        .then((result) => {
          if (result != null) {
            if (result.length < 1) {
              setHasMore(false);
            } else {
              setChatData(result);
            }
          } else {
            console.error(
              "There was an error fetching more chat data, returned",
              result
            );
          }
        })
        .catch((error) => {
          console.error("There was an error fetching more chat data: ", error);
        });
    }
    load();
  }, []);

  const fetchMoreData = async () => {
    if (chatData.length === 0) {
      setPage(0);
    }

    await getChatInfoByUserId(currentUserId, quantityPerPage, page)
      .then((result) => {
        if (result != null) {
          if (result.length < 1) {
            setHasMore(false);
          } else {
            let dataCopy = [...chatData];
            let newData = dataCopy.concat(result);
            setChatData(newData);
            setPage((currentPage) => currentPage + 1);
          }
        } else {
          console.error(
            "There was an error fetching more chat data, returned",
            result
          );
        }
      })
      .catch((error) => {
        console.error("There was an error fetching more chat info", error);
      });
  };

  const handleChatClick = (chatID) => {
    openChat(chatID);
  };

  return (
    <Box
      id="scrollableDiv"
      sx={{
        height: "100%",
        overflow: "auto",
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Chat Inbox
      </Typography>
      <hr />
      {chatData.length > 0 ? (
        <InfiniteScroll
          dataLength={chatData.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={<Loading doneLoading={!hasMore} page={page} />}
          scrollableTarget="scrollableDiv"
        >
          <List
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            {chatData.map((chat) => (
              <ListItem
                key={chat.chatID}
                divider
                sx={{
                  padding: "0px",
                  margin: "0",
                }}
              >
                <Button
                  fullWidth
                  onClick={() => handleChatClick(chat.chatID)}
                  sx={{
                    justifyContent: "flex-start",
                    textAlign: "left",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      width: "15%",
                      mr: 3,
                    }}
                  >
                    {/* Display senders avatar */}
                    <Avatar
                      sx={{
                        bgcolor: "#a3b18a",
                        width: 60,
                        height: 60,
                        border: "1px solid #000",
                      }}
                      alt="Sender Avatar"
                      src={`${apiUrl}/api/images/users/${chat.otherUserID}/profile`}
                    />
                  </Box>
                  <Box>
                    {
                      <Typography variant="body1">
                        {chat.otherUserName}
                      </Typography>
                    }
                    {
                      <>
                        {chat.hasUnread ? (
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: "bold" }}
                            color="textPrimary"
                          >
                            {truncateText(chat.mostRecentContent, 30)}
                          </Typography>
                        ) : (
                          <Typography variant="body2" color="textPrimary">
                            {truncateText(chat.mostRecentContent, 30)}
                          </Typography>
                        )}
                        <Typography variant="caption" color="textSecondary">
                          {new Date(chat.timestamp).toLocaleString()}
                        </Typography>
                      </>
                    }
                  </Box>
                </Button>
              </ListItem>
            ))}
          </List>
        </InfiniteScroll>
      ) : (
        <>
          <br />
          <Typography variant="body1" align="center">
            No messages found
          </Typography>
        </>
      )}
    </Box>
  );
}
