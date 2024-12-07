import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import Head from "next/head";
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
  const { getUserInfo, getOwnerInfo } = userService();
  const { getUserGrief } = guiltService();

  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { formatSize, formatSex, formatAge } = formatter();

  const [dislikeCount, setDislikeCount] = useState(0);
  const [killCount, setKillCount] = useState(0);
  const [rankTitle, setRankTitle] = useState("");
  const [rankMessage, setRankMessage] = useState("");

  // Fetch user info and grief details when page renders
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

          // Fetch user grief info
          const griefDetails = await getUserGrief(userId);

          if (griefDetails) {
            setDislikeCount(griefDetails.numDislikes || 0);
            setKillCount(griefDetails.killCount || 0);
            setRankTitle(griefDetails.rankTitle || "");
            setRankMessage(griefDetails.rankMessage || "");
          }
          // Don't set error if no grief details -- we won't be displaying the box anyways
        } catch (error) {
          setError(`User information could not be found for user ${userId}`);
        } finally {
          setLoading(false); // Set loading to false after fetching data
        }
      };
      fetchData(); // Call the fetch function for user info
    }
  }, [userId]); // Rerender if userId changes

  const handleEditInfoClick = () => {
    router.push(`/profile/${userId}/edit`);
  };

  const handleEditPreferencesClick = () => {
    router.push(`/profile/${userId}/preferences`);
  };

  const handleChangePasswordClick = () => {
    router.push(`/profile/${userId}/change-password`);
  };

  if ((loading || !userInfo) && !error)
    return (
      <>
        <Head>
          <title>Profile</title>
        </Head>

        <main>
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
        </main>
      </>
    );


  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        width: '100%',
        gap: 2,
      }}
    >
      {/* Top Row: Profile and User Info */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: '90%', // Scale with window size
          maxWidth: '1200px', // Max width to prevent stretching on large screens
          gap: 2,
          flexWrap: "wrap", // Allow wrapping on smaller screens
        }}
      >
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
            width: '48%', // Make width of top cards similar to bottom ones
          }}
        >
          <CardContent>
            <Typography variant="h3" component="div">
              {userInfo.nameFirst} {userInfo.nameLast}'s Profile
            </Typography>
          </CardContent>
          <Avatar
            sx={{
              bgcolor: "#a3b18a",
              width: 175,
              height: 175,
              border: "2px solid #000",
            }}
            alt={`${userInfo.nameFirst} ${userInfo.nameLast}`}
            src={`${apiUrl}/api/images/users/${userId}/profile`}
          />
        </Card>
        <Card sx={{ width: '48%', mb: 3, mt: 3 }}>
          <CardContent>
            <Typography mb={2} variant="h5">
              User Info
            </Typography>
            {userInfo && (
              <Stack spacing={3}>
                <Typography>First Name: {userInfo.nameFirst}</Typography>
                <Typography>Last Name: {userInfo.nameLast}</Typography>
                <Typography>Email: {userInfo.emailAddress}</Typography>
                {String(userId) === String(currentUserId) && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      flexDirection: "column",
                      mt: 2
                    }}
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
                    <Button
                      variant="contained"
                      color="secondary"
                      sx={{
                        padding: "12px 12px",
                        fontSize: "16px",
                        minWidth: "200px",
                      }}
                      onClick={handleChangePasswordClick}
                    >
                      Change Password
                    </Button>
                  </Box>
                )}
              </Stack>
            )}
          </CardContent>
        </Card>
      </Box>

      {/* Bottom Row: Conditional Kill Count and Preferences */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: '90%',
          maxWidth: '1200px',
          gap: 2
        }}
      >
        {killCount >= 1 && (
          <Card sx={{ width: '100%' }}>
            <CardContent sx={{ textAlign: "center", padding: 2 }}>
              {rankTitle && (
                <>
                  <Typography variant="h5">You have achieved the rank of: {rankTitle}</Typography>
                  <Typography variant="h6">{rankMessage}</Typography>
                  <Typography variant="body1">{`You have disliked ${dislikeCount} pets.`}</Typography>
                  <Typography variant="body1">{`This has resulted in ${killCount} deaths.`}</Typography>
                </>
              )}
            </CardContent>
          </Card>
        )}

        <Card sx={{ width: '100%' }}>
          <CardContent>
            <Typography mb={2} variant="h5">
              Preferences
            </Typography>
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
            {String(userId) === String(currentUserId) && (
              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{
                    padding: "12px 12px",
                    fontSize: "16px",
                    minWidth: "200px",
                  }} z
                  onClick={handleEditPreferencesClick}
                >
                  Adjust Preferences
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

