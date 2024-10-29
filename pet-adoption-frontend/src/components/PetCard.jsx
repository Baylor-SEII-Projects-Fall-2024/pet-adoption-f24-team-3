import React from "react";
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { Card, CardContent, Typography, Box, IconButton, Button } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import CardActions from "@mui/material/CardActions";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import formatter from "@/utils/formatter";
import recommendationService from "@/utils/services/recommendationService";
import { ThumbDownAltOutlined, ThumbUpAltOutlined, ThumbUpAltSharp } from "@mui/icons-material";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function PetCard(props) {
  const { pet } = props;
  const { formatSex } = formatter();
  const { likePet, dislikePet } = recommendationService();
  const currentUserId = useSelector((state) => state.currentUser.currentUserId); // get the current session user
  const currentUserType = useSelector((state) => state.currentUser.currentUserType);

  const onLikePet = (event) => {
    event.stopPropagation();
    likePet(currentUserId, pet.id);
  };

  const onDislikePet = (event) => {
    event.stopPropagation();
    dislikePet(currentUserId, pet.id);
  };

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
        </Box>
      </CardContent>
      {currentUserType == "Owner" && (
        <CardActions sx={{
          marginTop: "auto",
          justifyContent: "center",
          height: "60px",
          pl: "15%",
          pr: "15%",
        }}>
          <Button
            onClick={onLikePet}
            className="hidden-button"
            variant="like">
            <ThumbUpAltOutlined fontSize="large" />
          </Button>
          <Button
            onClick={onLikePet}
            className="hidden-button"
            variant="dislike">
            <ThumbDownAltOutlined fontSize="large" color="dislike" />
          </Button>

        </CardActions>
      )}

    </Card>
  );
}
