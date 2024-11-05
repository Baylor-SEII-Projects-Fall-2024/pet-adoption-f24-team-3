import React, { useState, useEffect } from 'react';
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const chatService = () => {

    function getOrCreate({ senderID, receiverID }) {
    };

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

    function getChatInfoByUserID({ userID, pageSize, pageNumber }) {
        return new Promise((resolve, reject) => {
            let url = `${apiUrl}/api/chats/chat-info-by-user?userID=${userID}`;

            if (pageSize !== undefined && pageNumber !== undefined) {
                url += `&pageSize=${pageSize}&pageNumber=${pageNumber}`;
            }

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

    return {
        getOrCreate,
        chatList,
        getChatInfoByUserID,
    };

};

export default chatService;
