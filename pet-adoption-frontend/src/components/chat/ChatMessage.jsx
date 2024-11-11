import { Box, Typography } from "@mui/material";

export default function ChatMessage(props) {
    const { message, isSender, senderName } = props;

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const isToday = date.toDateString() === now.toDateString();

        if (isToday) {
            // Show only the time if the date is today
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else {
            // Show the day and month for other dates
            return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
        }
    }

    return (
        <Box
            sx={{
                width: "100%",
                display: "flex",
                justifyContent: isSender ? 'flex-end' : 'flex-start',
            }}>
            <Box
                key={message.messageID}
                sx={{
                    marginBottom: '10px',
                    padding: '5px 10px 5px 10px',

                    backgroundColor: isSender ? '#e6f7ff' : '#f0f0f0',
                    borderRadius: '4px',
                    minWidth: "60%",
                    maxWidth: "80%",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                    }}
                >
                    <strong>
                        {senderName}
                    </strong>
                    <Typography variant="subtitle1" color="text.secondary" sx={{ pl: "10px" }}>
                        {formatDate(message.timestamp)}
                    </Typography>
                </Box>

                <p>{message.content}</p>
            </Box>
        </Box>

    );
}