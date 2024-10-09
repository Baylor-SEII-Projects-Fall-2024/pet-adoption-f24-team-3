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

export default function ProfilePage() {
  const router = useRouter();
  const { userId } = router.query; // get user ID from the routing
  const currentUserId = useSelector((state) => state.currentUser.currentUserId); // get the current session user
  const { getOwnerInfo } = userService();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user info when page renders
  useEffect(() => {
    if (userId) {
      const fetchUserInfo = async () => {
        try {
          const result = await getOwnerInfo(userId);
          if (result !== null) {
            setUserInfo(result);
          }
          // Set error state if not ok
        } catch (error) {
          setError(`User information could not be found for user ${userId}`);
          // Revert loading state
        } finally {
          setLoading(false);
        }
      };
      fetchUserInfo();
    }
  }, [userId]); // rerender if userId changes

  const handleEditInfoClick = () => {
    router.push(`/profile/${userId}/edit`);
  };

  const handleEditPreferencesClick = () => {
    router.push(`/profile/${userId}/preferences`);
  };

  if (loading)
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

  if (error)
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
            src={
              userInfo && userInfo.profilePicPath ? userInfo.profilePicPath : ""
            }
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
                <Typography>Size: {userInfo.preference.size}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography>Sex: {userInfo.preference.sex}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography>Age: {userInfo.preference.ageClass}</Typography>
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
