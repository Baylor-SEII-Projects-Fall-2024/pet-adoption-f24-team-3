import { Box, Button, Typography } from "@mui/material";
import { useChat } from "@/utils/contexts/chatContext";

export default function ContactCard(props) {
    const { contactee } = props;
    const { openChat } = useChat();

    const handleContact = async (event) => {
        /* Send a message to contactee, if NULL then return
         */
        if(contactee == null){
            return
        }
        openChat(contactee)
    }

    return(
        <Box
        sx={{
            width: "100%",
            height: "auto",
            paddingTop: "1rem",
            paddingBottom: "1rem",
        }}>
        <Button
            variant="contained"
            color="primary"
            sx={{
                fontSize: "20px",
                minWidth: "150px",
            }}
            onClick={handleContact}
        > Contact 
        </Button>

        </Box>
    )
}