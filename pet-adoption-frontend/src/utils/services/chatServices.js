
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const chatServices = () => {
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

    const getOrCreateChatID = async(senderID, receiverID) => {
        const response = await fetch(`${apiUrl}/api/chats/get-or-create?senderID=${senderID}&receiverID=${receiverID}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        });
        const result = await response.json();
        if (response.ok) {
            return result.id;
        } else {
            alert(`Get/create chatID failed: ${result.message}`);
            return null;
        }
    }

    return{
        getUnreadMessages,
        sendMessage,
        getOrCreateChatID
    };
};
export default chatServices;