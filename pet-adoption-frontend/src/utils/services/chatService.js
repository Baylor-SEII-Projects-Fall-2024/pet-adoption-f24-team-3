import React, { useState, useEffect } from 'react';
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const chatService = () => {

    function chatList({ userId }) {
        const [chats, setChats] = useState([]);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState(null);

        useEffect(() => {
            const fetchChats = async () => {
                try {
                    const response = await fetch(`${apiUrl}/api/chats/by-user?userID={userId}`);
                    if(!response.ok) {
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

        if(loading) return <div>Loading...</div>;
        if(error) return <div>Error: {error}</div>;

        return (
            <div>
                {chats.map(chat => (
                    <div key={chat.charId}>
                    </div>
                ))}
            </div>
        );
    }

    function getChatInfoByUserId({ userID }) {
        return new Promise((resolve, reject) => {
            let url = `${apiUrl}/api/chats/chat-info-by-user?userID=${userID}`;

            fetch(url)
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

    function getChatByChatId({ currentChatId }) {
        return new Promise((resolve, reject) => {
            let url = `${apiUrl}/api/chats/by-chatID?chatID=${currentChatId}`;

            fetch(url)
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
    /* ========== */
    const getUnreadMessages = async (userId) => {
        const response = await fetch(`${apiUrl}/api/chats/unread-count?userID=${userId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
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
    const sendMessage = async(chatID, sender, contactee, content, stompClient) => { /* Params will need to be cleaned up later */
        if (stompClient) {
          const chatMessage = {
            chatID: chatID,
            senderID: sender,
            recipientID: contactee,
            content: content,
          };
          console.log("Sending message:", chatMessage);
          stompClient.send(`/app/chat/${chatID}`, {}, JSON.stringify(chatMessage));
        //   setMessage("");
        }
    };

    const getOrCreateChat = async(senderID, receiverID) => {
        const response = await fetch(`${apiUrl}/api/chats/get-or-create?senderID=${senderID}&receiverID=${receiverID}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
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
    const getByChatID = async(chatId) => {
        const response = await fetch(`${apiUrl}/api/chats/${chatId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
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

    return{
        chatList,
        getChatInfoByUserId,
        getChatByChatId,
        getUnreadMessages,
        sendMessage,
        getOrCreateChat,
        getByChatID
    };
};

export default chatService;
