import React from "react";
import { useSelector } from 'react-redux';
import { Card, CardContent, Typography, Box } from "@mui/material";
import { Close } from "@mui/icons-material";
import CardActions from "@mui/material/CardActions";
import formatter from "@/utils/formatter";
import LikeButtons from "./LikeButtons";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function PetCard(props) {
  const { pet, updateTotalDislikes, euthanizedPetIds } = props;
  const { formatSex } = formatter();
  const [hasInteracted, setHasInteracted] = React.useState(false);
  const currentUserId = useSelector((state) => state.currentUser.currentUserId); // get the current session user
  const currentUserType = useSelector((state) => state.currentUser.currentUserType);

  const isEuthanized = (euthanizedPetIds && euthanizedPetIds.includes(pet.id)) || false;

  const onLikeInteraction = (buttonPressed) => {
    setHasInteracted(buttonPressed);
  }

  let styles = {
    noOverflow: {
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    },
    imageNormal: {
      width: "100%",
      maxHeight: "auto",
      borderRadius: "2%",
      aspectRatio: 1,
      objectFit: "cover",
    },
    imageCursed: {
      width: "100%",
      maxHeight: "auto",
      borderRadius: "2%",
      aspectRatio: 1,
      objectFit: "cover",
      filter: "contrast(400%) brightness(60%) saturate(700%) hue-rotate(-30deg)",
      animation: "shake 0.5s infinite linear",
      backfaceVisibility: "hidden",
      transform: "scale(1.5) rotate(-15deg)",
      border: "2px solid #a71111"
    }
  };

  return (
    <Card
      key={pet.id}
      sx={{
        display: "flex",
        flexDirection: "column",
        mb: 2,
        width: "100%",
        "&:hover": {
          animation: " scaleUp 0.2s ease-in-out forwards"
        },
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
            //height: "300px",
            overflow: "hidden",
            position: "relative"
          }}
        >
          <img
            style={isEuthanized ? styles.imageCursed : styles.imageNormal}
            className='shake-animation'
            alt="Pet Photo"
            src={`${apiUrl}/api/images/animals/${pet.id}`}
          />
          {isEuthanized && (
            <Close sx={{
              position: "absolute",
              top: "0px",
              left: "0px",
              bottom: 0,
              right: 0,
              width: "100%",
              height: "100%",
              fontSize: "50px",
              color: "#ff0000",
              cursor: "pointer",
              animation: "shake 0.5s infinite linear",

            }}
              className='shake-animation'
            />)}
        </Box>
        <Box>
          <Typography variant="h5" sx={styles.noOverflow}>
            {pet.name}
          </Typography>
          <Typography sx={styles.noOverflow}>
            {pet.age} yr. old {formatSex(pet.sex)}
          </Typography>
          <Typography sx={styles.noOverflow}  >
            {pet.breed}
          </Typography>
        </Box>
      </CardContent>
      {currentUserType == "Owner" && (
        <CardActions sx={{ height: "60px", paddingTop: "5px" }}>

          {isEuthanized ? (
            <div
              style={{
                width: "100%",
                paddingLeft: "10%",
                paddingRight: "10%",
                marginBottom: "1rem",
              }}
            >
              <div
                style={{
                  color: "red",
                  fontFamily: "monospace",
                  fontSize: "clamp(0.8rem, 1.5vw, 2rem)",
                  marginTop: "1rem",
                  marginBottom: "1rem",
                }}
              >
                PROCESSED FOR EUTHANIZATION
              </div>
            </div>
          ) : (
            <div className={`${!hasInteracted ? "hidden-button" : ""}`}
              style={{
                width: "100%",
                paddingLeft: "10%",
                paddingRight: "10%",
              }}>
              <LikeButtons
                petId={pet.id}
                userId={currentUserId}
                onInteract={onLikeInteraction}
                initiallyLiked={pet.isLiked}
                initiallyDisliked={pet.isDisliked}
                updateTotalDislikes={(petId, decrement) => updateTotalDislikes(petId, decrement)}
              />
            </div>
          )}

        </CardActions>
      )}

    </Card>
  );
}
