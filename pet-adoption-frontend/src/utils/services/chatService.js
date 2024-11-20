import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;


const chatService = () => {
    const authenticationToken = useSelector((state) => state.authenticationToken.token);

    function chatList(userId) {
        const [chats, setChats] = useState([]);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState(null);

        useEffect(() => {
            const fetchChats = async () => {
                try {
                    const response = await fetch(`${apiUrl}/api/chats/byUser?userID=${userId}`, {
                        method: 'GET',
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${authenticationToken}`,
                        },
                    });
                    if (!response.ok) {
                        throw new Error(`Failed to fetch chats for {userId}`);
                    }
                    const data = await response.json();
                    setChats(data);
                    setLoading(false);
                } catch (err) {
                    setError(err.message);
                    setLoading(false);
                }
            };

            fetchChats();
        }, [userId]);

        if (loading) return <div>Loading...</div>;
        if (error) return <div>Error: {error}</div>;

        return (
            <div>
                {chats.map(chat => (
                    <div key={chat.charId}>
                    </div>
                ))}
            </div>
        );
    }

    function getChatInfoByUserId(userID, pageSize, pageNumber) {
        return new Promise((resolve, reject) => {
            fetch(`${apiUrl}/api/chats/chatInfoByUser?userID=${userID}&pageNumber=${pageNumber}&pageSize=${pageSize}`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${authenticationToken}`,
                },
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to fetch chat info');
                    }
                    return response.json();
                })
                .then(data => resolve(data))
                .catch(error => {
                    console.error('Error:', error);
                    reject(error);
                });
        });
    }

    function getMessagesByChatId(currentChatId) {
        return new Promise((resolve, reject) => {
            let url = `${apiUrl}/api/chats/byChatID?chatID=${currentChatId}`;

            fetch(url, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${authenticationToken}`,
                },
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Failed to fetch chat by id = ${chatID}`)
                    }
                    return response.json();
                })
                .then(data => resolve(data))
                .catch(error => {
                    console.error('Error:', error);
                    reject(error);
                });
        });
    }

    const getUnreadMessages = async (userId) => {
        const response = await fetch(`${apiUrl}/api/chats/unreadCount?userID=${userId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authenticationToken}`,
            }
        });

        const result = await response.json();
        if (response.ok) {
            return result;
        } else {
            alert(`Get unread count failed: ${result.message}`);
            return null;
        }
    }
    const sendMessage = async (chatID, sender, contactee, content, stompClient) => { /* Params will need to be cleaned up later */
        if (stompClient) {
            const chatMessage = {
                chatID: chatID,
                senderID: sender,
                recipientID: contactee,
                content: content,
            };
            stompClient.send(`/app/chat/${chatID}`, {}, JSON.stringify(chatMessage));
        }
    };

    const getOrCreateChat = async (senderID, receiverID) => {
        const response = await fetch(`${apiUrl}/api/chats/getOrCreate?senderID=${senderID}&receiverID=${receiverID}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authenticationToken}`,
            }
        });
        const result = await response.json();
        if (response.ok) {
            return result;
        } else {
            alert(`Get/create chatID failed: ${result.message}`);
            return null;
        }
    }
    const getChatByChatID = async (chatId) => {
        const response = await fetch(`${apiUrl}/api/chats/${chatId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authenticationToken}`,
            }
        });
        const result = await response.json();
        if (response.ok) {
            return result;
        } else {
            alert(`Get chatID failed: ${result.message}`);
            return null;
        }
    }

    const updateMessageStatus = async (messageID, status) => {
        const response = await fetch(`${apiUrl}/api/chats/messageReadStatus?messageID=${messageID}&status=${status}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authenticationToken}`,
            }
        });
        const result = await response.json();
        if (response.ok) {
            return result;
        } else {
            alert(`Updating message failed: ${result.message}`);
            return null;
        }
    }

    return {
        chatList,
        getChatInfoByUserId,
        getMessagesByChatId,
        getUnreadMessages,
        sendMessage,
        getOrCreateChat,
        getChatByChatID,
        updateMessageStatus,
    };
};

export default chatService;
