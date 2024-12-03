import React from "react";
import { Box, Button } from "@mui/material";
import { ThumbDown, ThumbDownAltOutlined, ThumbUp, ThumbUpAltOutlined } from "@mui/icons-material";

import recommendationService from "@/utils/services/recommendationService";

export default function LikeButtons(props) {

  const [isLiked, setIsLiked] = React.useState(false);
  const [isDisliked, setIsDisliked] = React.useState(false);
  const { likePet, dislikePet, undoLikePet, undoDislikePet } = recommendationService();
  const { petId, userId, onInteract, initiallyLiked, initiallyDisliked, updateTotalDislikes } = props;


  React.useEffect(() => {
    function setInitialLikeStatus() {
      if (initiallyLiked && initiallyDisliked) {
        return;
      }
      else if (initiallyLiked) {
        setIsLiked(true);
      }
      else if (initiallyDisliked) {
        setIsDisliked(true);
      }
    }
    setInitialLikeStatus();

  }, []);

  const onLikePet = async (event) => {
    event.stopPropagation();
    if (isLiked) {
      //if already liked, untoggle the like button and undo like
      setIsLiked(false);
      if (onInteract)
        onInteract(false);
      //save the undo
      await undoLikePet(userId, petId)
        .catch((error) => {
          console.error("Error liking pet:", error);
        })
    }
    else {
      //if not yet liked, like the pet
      setIsLiked(true);

      //if the pet has been disliked, undo that
      if (isDisliked) {
        setIsDisliked(false);
        await undoDislikePet(userId, petId)
          .catch((error) => {
            console.error("Error undo disliking pet:", error);
          })
      }

      if (onInteract)
        onInteract(true);

      //save like
      await likePet(userId, petId)
        .catch((error) => {
          console.error("Error liking pet:", error);
        })
    }
  }

  const onDislikePet = async (event) => {
    event.stopPropagation();
    if (isDisliked) {
      //if already disliked, untoggle the like button and undo dislike
      setIsDisliked(false);

      if (onInteract)
        onInteract(false);

      //save the undo
      await undoDislikePet(userId, petId)
        .catch((error) => {
          console.error("Error undo disliking pet:", error);
        })
    }
    else {
      //if not yet disliked, dislike the pet
      setIsDisliked(true);

      //if was formerly liked, undo that
      if (isLiked) {
        setIsLiked(false);
        await undoLikePet(userId, petId)
          .catch((error) => {
            console.error("Error undo disliking pet:", error);
          })
      }

      if (onInteract)
        onInteract(true);

      //save the dislike
      await dislikePet(userId, petId)
        .catch((error) => {
          console.error("Error disliking pet:", error);
        })

      // Update dislike count
      console.log("LikeButtons handling updating dislike count");
      updateTotalDislikes();
    }
  }

  //dont render if missing info
  if (!petId || !userId) {
    return;
  }

  return (
    <Box sx={{
      flex: 1,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      mb: "20px",
    }}>
      <Button
        onClick={onLikePet}
        variant="like">
        {isLiked ? (
          <ThumbUp fontSize="large" />
        ) : (
          < ThumbUpAltOutlined fontSize="large" />
        )}
      </Button>
      <Button
        onClick={onDislikePet}
        variant="dislike">
        {isDisliked == true ? (
          <ThumbDown fontSize="large" />
        ) : (
          <ThumbDownAltOutlined fontSize="large" />
        )}
      </Button>
    </Box>

  );
}
