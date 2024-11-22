import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import eventService from "@/utils/services/eventService";
import animalService from "@/utils/services/animalService";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function ChatLink(props) {
  const { message, isSender, senderName } = props;
  const linkType = message.link.includes("event") ? "event" : "pet";
  const [linkedName, setLinkedName] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [id, setId] = useState(null);

  const { getEventInfo } = eventService();
  const { getPetInfo } = animalService();

  const extractNumber = (str) => {
    const match = str.match(/\/(\d+)$/);
    return match ? match[1] : null;
  };

  useEffect(() => {
    const extractedId = extractNumber(message.link);
    if (extractedId) {
      setId(extractedId);

      if (linkType === "event") {
        fetchEvent(extractedId);
      } else {
        fetchPet(extractedId);
      }
    } else {
      console.error("Invalid link format:", message.link);
    }
  }, [message.link, linkType]);

  async function fetchEvent(eventID) {
    try {
      const result = await getEventInfo(eventID);
      if (result) {
        setLinkedName(result.name);
        setPhotoUrl(`${apiUrl}/api/images/events/${id}`);
        console.log(photoUrl);
      } else {
        console.error(`Error loading event ${eventID}: No result`);
      }
    } catch (error) {
      console.error(`Error loading event ${eventID}:`, error);
    }
  }

  async function fetchPet(petID) {
    try {
      const result = await getPetInfo(petID);
      if (result) {
        setLinkedName(result.name);
        setPhotoUrl(`${apiUrl}/api/images/animals/${id}`);
      } else {
        console.error(`Error loading pet ${petID}: No result`);
      }
    } catch (error) {
      console.error(`Error loading pet ${petID}:`, error);
    }
  }

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: isSender ? "flex-end" : "flex-start",
      }}
    >
      <Box
        key={message.messageID}
        sx={{
          padding: "10px",
          backgroundColor: isSender ? "#DCF8C6" : "#FFFFFF",
          borderRadius: "10px",
          maxWidth: "60%",
        }}
      >
        <Typography variant="body1">{linkedName}</Typography>
        {photoUrl && <img src={photoUrl} alt={linkedName} />}
      </Box>
    </Box>
  );
}
