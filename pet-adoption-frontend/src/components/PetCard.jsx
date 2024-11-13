import React from "react";
import { useSelector } from 'react-redux';
import { Card, CardContent, Typography, Box } from "@mui/material";
import CardActions from "@mui/material/CardActions";
import formatter from "@/utils/formatter";
import LikeButtons from "./LikeButtons";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function PetCard(props) {
  const { pet } = props;
  const { formatSex } = formatter();
  const [hasInteracted, setHasInteracted] = React.useState(false);
  const currentUserId = useSelector((state) => state.currentUser.currentUserId); // get the current session user
  const currentUserType = useSelector((state) => state.currentUser.currentUserType);

  const onLikeInteraction = (buttonPressed) => {
    setHasInteracted(buttonPressed);
  }

  return (
    <Card
      key={pet.id}
      sx={{
        display: "flex",
        flexDirection: "column",
        mb: 2,
        width: "100%",
        "& .hidden-button": {
          display: "none",
        },
        "&:hover .hidden-button": {
          display: "inline-flex",
        },

      }}
    >
      <CardContent>
        <Box
          sx={{
            flex: 0.8,
            width: "100%",
            height: "300px",
            overflow: "hidden",
          }}
        >
          <img
            style={{
              width: "100%",
              maxHeight: "auto",
              borderRadius: "2%",
              aspectRatio: 1,
              objectFit: "cover",
            }}
            alt="Pet Photo"
            src={`${apiUrl}/api/images/animals/${pet.id}`}
          />
        </Box>
        <Box>
          <Typography variant="h5">
            {pet.name}, {pet.age}
          </Typography>
          <Typography>
            {formatSex(pet.sex)} {pet.breed}
          </Typography>
          <Typography>
            {pet.score}
          </Typography>
        </Box>
      </CardContent>
      {currentUserType == "Owner" && (
        <CardActions sx={{ height: "60px" }}>
          <div className={`${!hasInteracted ? "hidden-button" : ""}`}
            style={{
              width: "100%",
              paddingLeft: "10%",
              paddingRight: "10%",
            }}>
            <LikeButtons petId={pet.id} userId={currentUserId} onInteract={onLikeInteraction} initiallyLiked={pet.isLiked} initiallyDisliked={pet.isDisiked} />
          </div>
        </CardActions>
      )}

    </Card>
  );
}
