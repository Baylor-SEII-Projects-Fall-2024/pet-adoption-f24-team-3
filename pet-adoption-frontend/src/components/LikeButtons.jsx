import React from "react";
import { Box, Button } from "@mui/material";
import { ThumbDown, ThumbDownAltOutlined, ThumbUp, ThumbUpAltOutlined } from "@mui/icons-material";

import recommendationService from "@/utils/services/recommendationService";

export default function LikeButtons(props) {

    const [isLiked, setIsLiked] = React.useState(false);
    const [isDisliked, setIsDisliked] = React.useState(false);
    const { likePet, dislikePet } = recommendationService();
    const { petId, userId, onInteract } = props;

    const onLikePet = async (event) => {
        event.stopPropagation();
        if (isLiked) {
            //if already liked, untoggle the like button and undo like
            setIsLiked(false);
            if (onInteract)
                onInteract(false);
        }
        else {
            //if not yet liked, like the pet
            setIsLiked(true);
            setIsDisliked(false);
            if (onInteract)
                onInteract(true);
            await likePet(userId, petId)
                .then(() => {
                })
                .catch((error) => {
                    console.error("Error liking pet:", error);
                })
        }

    }
    const onDislikePet = async (event) => {
        event.stopPropagation();
        if (isDisliked) {
            //if already liked, untoggle the like button and undo like
            setIsDisliked(false);
            if (onInteract)
                onInteract(false);
        }
        else {
            //if not yet liked, like the pet
            setIsLiked(false);
            setIsDisliked(true);
            if (onInteract)
                onInteract(true);
            await dislikePet(userId, petId)
                .then(() => {
                })
                .catch((error) => {
                    console.error("Error liking pet:", error);
                })
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