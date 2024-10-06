import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { Button, Card, CardContent, Stack, Typography, Avatar, Box, Grid} from '@mui/material';
import userService from '@/utils/services/userService';

export default function ProfilePage() {
  const router = useRouter();
  const { userId } = router.query; // get user ID from the routing
  const currentUserId = useSelector(state => state.currentUser.currentUserId);
  const { getUserInfo } = userService();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (userId) {
      const fetchUserInfo = async () => {
        try {
          const result = await getUserInfo(userId);
          if (result !== null) {
            setUserInfo(result);
          } 
        } catch (error) {
          console.error("Error: ", error);
          setError("An error occurred during fetching user information");
        } finally {
          setLoading(false);
        }
      };

      fetchUserInfo();
    }
  }, [userId, router]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        minHeight: '100vh',
        flexDirection: 'column',
      }}
    >
      <Card sx={{ 
        minWidth: 275, 
        mb: 3,
        mt: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
        paddingBottom: 4
        }}>
        <CardContent>
        <Typography 
          variant="h3" 
          component="div"
          sx={{
            wordBreak: 'break-word',
            whiteSpace: 'normal'
          }}>
          {userInfo.nameFirst} {userInfo.nameLast}'s Profile
        </Typography>
        </CardContent>
        <Avatar
          sx={{ 
            bgcolor: '#a3b18a',
            width: 175,
            height: 175,
            border: '2px solid #000'
          }}
          alt={userInfo ? `${userInfo.nameFirst} ${userInfo.nameLast}` : 'User Avatar'}
          src={userInfo && userInfo.profilePicPath ? userInfo.profilePicPath : ''}
        />
      </Card>
      <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        padding: 2
      }}>
      <Card sx={{ mb: 2, mr: 2}}>
        <CardContent>
          <Typography mb='2' variant="h5">User Info</Typography>
          {userInfo && (
            <Stack spacing={3}>
              <Typography>First Name: {userInfo.nameFirst}</Typography>
              <Typography>Last Name: {userInfo.nameLast}</Typography>
              <Typography>Email: {userInfo.emailAddress}</Typography>
            </Stack>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <Typography mb={2} variant="h5">Preferences</Typography>
          {userInfo && userInfo.preference && (
            <Grid container spacing={2}>
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
        </CardContent>
      </Card>
      </Box>
    </Box>
  );
}
