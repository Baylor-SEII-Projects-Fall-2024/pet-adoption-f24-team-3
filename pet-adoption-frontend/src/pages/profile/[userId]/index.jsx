import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import {
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
  Avatar,
  Box,
  Grid,
} from "@mui/material";
import userService from "@/utils/services/userService";
import guiltService from "@/utils/services/guiltService";
import formatter from "@/utils/formatter";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;


export default function ProfilePage() {
  const router = useRouter();
  const { userId } = router.query; // get user ID from the routing
  const currentUserId = useSelector((state) =>
    state.currentUser.currentUserId !== null
      ? state.currentUser.currentUserId
      : null
  ); // get the current session user
  const { getOwnerInfo, getUserInfo } = userService();
  const { getProfileDislikeCount, getDislikeTitleAndMessage } = guiltService();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { formatSize, formatSex, formatAge } = formatter();

  const [dislikeCount, setDislikeCount] = useState(0);

  // Fetch user info when page renders
  useEffect(() => {
    if (userId) {
      const fetchData = async () => {
        try {
          // Fetch user type
          const userTypeResult = await getUserInfo(userId);
          if (userTypeResult.accountType === "Center") {
            await router.push(`/centers/${userId}`);
            return; // Exit early if redirected
          }

          // Fetch owner info
          const ownerInfoResult = await getOwnerInfo(userId);
          if (ownerInfoResult !== null) {
            setUserInfo(ownerInfoResult);
          } else {
            setError(`User information could not be found for user ${userId}`);
          }
        } catch (error) {
          setError(`User information could not be found for user ${userId}`);
        } finally {
          setLoading(false); // Set loading to false after fetching data
        }
      };

      fetchData(); // Call the fetch function for user info
    }
  }, [userId]); // Rerender if userId changes

  // Fetch dislike count when userId is available and defined
  useEffect(() => {
    const fetchDislikeCount = async () => {
      if (userId) { // Check if userId is defined before fetching dislike count
        try {
          const dislikeResult = await getProfileDislikeCount(userId); // Fetch dislike count here
          setDislikeCount(dislikeResult || 0); // Set dislike count or default to 0
        } catch (error) {
          console.error("Error fetching dislike count:", error);
        }
      }
    };

    fetchDislikeCount(); // Call the fetch function for dislikes
  }, [userId]); // This effect runs whenever userId changes

  // Determine a user's kill count
  const { title, message } = getDislikeTitleAndMessage(dislikeCount);

  const handleEditInfoClick = () => {
    router.push(`/profile/${userId}/edit`);
  };

  const handleEditPreferencesClick = () => {
    router.push(`/profile/${userId}/preferences`);
  };

  if (loading) {
    return (
      // Create flex box to contain all components
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {/* Create loading card */}
        <Card sx={{ minWidth: 275, mb: 2 }}>
          <CardContent>
            <Typography variant="h5" component="div">
              Loading...
            </Typography>
          </CardContent>
        </Card>
      </Box>
    );
  }

  if (!userInfo) {
    return (
      // Create flex box to contain all components
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {/* Create loading card */}
        <Card sx={{ minWidth: 275, mb: 2 }}>
          <CardContent>
            <Typography variant="h5" component="div">
              Loading...
            </Typography>
          </CardContent>
        </Card>
      </Box>
    );
  }

  if (error) {
    return (
      // Create flex box to contain all components
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {/* Create error card */}
        <Card sx={{ minWidth: 275, mb: 2 }}>
          <CardContent>
            <Typography variant="h5" component="div" color="error">
              {error}
            </Typography>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    // Create flex box to contain all components
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        minHeight: "100vh",
        flexDirection: "column",
        gap: 2,
      }}
    >
      {/* Create flex box to contain Avatar and User Info cards */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        {/* Create card to display users name and avatar */}
        <Card
          sx={{
            minWidth: 275,
            mb: 3,
            mt: 3,
            mr: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 2,
            paddingBottom: 4,
          }}
        >
          {/* Display users name */}
          <CardContent>
            <Typography
              variant="h3"
              component="div"
              sx={{
                wordBreak: "break-word", // wrap should overflow occur
                whiteSpace: "normal",
              }}
            >
              {userInfo.nameFirst} {userInfo.nameLast}'s Profile
            </Typography>
          </CardContent>
          {/* Display users avatar */}
          <Avatar
            sx={{
              bgcolor: "#a3b18a",
              width: 175,
              height: 175,
              border: "2px solid #000",
            }}
            alt={
              userInfo
                ? `${userInfo.nameFirst} ${userInfo.nameLast}`
                : "User Avatar"
            }
            src={`${apiUrl}/api/images/users/${userId}/profile`}
          />
          {/* Create card to display User Info */}
        </Card>
        <Card sx={{ mb: 3, mt: 3 }}>
          <CardContent>
            {/* Title */}
            <Typography mb={2} variant="h5">
              User Info
            </Typography>
            {/* Info and conditional edit button */}
            {userInfo && (
              <Stack spacing={3}>
                <Typography>First Name: {userInfo.nameFirst}</Typography>
                <Typography>Last Name: {userInfo.nameLast}</Typography>
                <Typography>Email: {userInfo.emailAddress}</Typography>
                {/* Display edit button if user is viewing their own page */}
                {String(userId) === String(currentUserId) && (
                  <Box
                    sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}
                  >
                    <Button
                      variant="contained"
                      color="secondary"
                      sx={{
                        padding: "12px 12px",
                        fontSize: "16px",
                        minWidth: "200px",
                      }}
                      onClick={handleEditInfoClick}
                    >
                      Edit Info
                    </Button>
                  </Box>
                )}
              </Stack>
            )}
          </CardContent>
        </Card>
      </Box>

      {/* Create card to display dislike information */}
      {dislikeCount >= 5 && ( // Only show this box if there are at least five dislikes
        <Card sx={{ mb: 3, width: '70%' }}> {/* Set width to match preferences card */}
          <CardContent sx={{ textAlign: "center", padding: 2 }}> {/* Center align text and add padding */}
            {/* Conditionally render title and message based on dislike count */}
            {title && (
              <>
                <Typography variant="h5">You have achieved the rank of: {title}</Typography>
                <Typography variant="h6">{message}</Typography>
                <Typography variant="body1">{`You have disliked ${dislikeCount} pets.`}</Typography>
                <Typography variant="body1">{`This has resulted in ${Math.floor(dislikeCount / 5)} deaths.`}</Typography> {/* Use Math.floor for whole number */}
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Create card to display preferences */}
      <Card>
        <CardContent>
          {/* Title */}
          <Typography mb={2} variant="h5">
            Preferences
          </Typography>
          {/* Display info as grid */}
          {userInfo && userInfo.preference && (
            <Grid container spacing={2.5}>
              <Grid item xs={12} sm={6}>
                <Typography>City: {userInfo.preference.city}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography>State: {userInfo.preference.state}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography>Species: {userInfo.preference.species}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography>Breed: {userInfo.preference.breed}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography>Size: {formatSize(userInfo.preference.size)}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography>Sex: {formatSex(userInfo.preference.sex)}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography>Age: {formatAge(userInfo.preference.ageClass)}</Typography>
              </Grid>
            </Grid>
          )}
          {/* Conditional edit button if user is viewing their own page */}
          {String(userId) === String(currentUserId) && (
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                sx={{
                  padding: "12px 12px",
                  fontSize: "16px",
                  minWidth: "200px",
                }}
                onClick={handleEditPreferencesClick}
              >
                Adjust Preferences
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
