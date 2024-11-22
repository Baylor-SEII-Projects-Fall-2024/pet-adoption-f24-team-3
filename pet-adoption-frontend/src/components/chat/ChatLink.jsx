import React, { useEffect, useState } from "react";
import { Box, Typography, Avatar } from "@mui/material";
import { useRouter } from "next/router";
import eventService from "@/utils/services/eventService";
import animalService from "@/utils/services/animalService";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function ChatLink(props) {
  const { message, isSender, senderName } = props;
  const linkType = message.link.includes("event") ? "event" : "pet";
  const [linkedName, setLinkedName] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [id, setId] = useState(null);

  const router = useRouter();

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
        setPhotoUrl(
          `${apiUrl}/api/images/events/${extractNumber(message.link)}`
        );
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
        setPhotoUrl(
          `${apiUrl}/api/images/animals/${extractNumber(message.link)}`
        );
      } else {
        console.error(`Error loading pet ${petID}: No result`);
      }
    } catch (error) {
      console.error(`Error loading pet ${petID}:`, error);
    }
  }

  return (
    <button
      onClick={() => router.push(message.link)}
      rel="noopener noreferrer"
      style={{
        textDecoration: "none",
        color: "#333333",
        width: "100%",
        background: "none",
        border: "none",
        cursor: "pointer",
      }}
    >
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
            marginBottom: "10px",
            padding: "5px 10px 5px 10px",

            backgroundColor: isSender ? "#e6f7ff" : "#f0f0f0",
            borderRadius: "4px",
            minWidth: "60%",
            maxWidth: "80%",
            display: "flex",
          }}
        >
          {photoUrl && <Avatar alt={linkedName} src={`${photoUrl}`}></Avatar>}
          <Box
            sx={{
              margin: "auto",
            }}
          >
            <Typography variant="body1" fontWeight="bold">
              {linkedName}
            </Typography>
            <Typography variant="caption">
              {linkType.replace(
                linkType.charAt(0),
                linkType.charAt(0).toUpperCase()
              )}
            </Typography>
          </Box>
        </Box>
      </Box>
    </button>
  );
}
