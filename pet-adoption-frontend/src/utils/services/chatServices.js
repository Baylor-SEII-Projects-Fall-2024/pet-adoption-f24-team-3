
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


    return{
        getUnreadMessages,
    };
};
export default chatServices;