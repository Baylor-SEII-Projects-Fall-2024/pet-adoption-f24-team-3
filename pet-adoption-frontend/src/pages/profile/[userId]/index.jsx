import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { Button, Card, CardContent, Stack, Typography, Avatar, Box} from '@mui/material';
import { deepOrange } from '@mui/material/colors';
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
        mb: 2,
        mt: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2
        }}>
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
        <CardContent>
        <Typography variant="h5" component="div">
          {userInfo.nameFirst} {userInfo.nameLast}
        </Typography>
        </CardContent>

      </Card>
      <Card>
        <CardContent>
          <Typography mb='2' variant="h5">User Profile</Typography>
          {userInfo && (
            <Stack spacing={3}>
              <Typography>First Name: {userInfo.nameFirst}</Typography>
              <Typography>Last Name: {userInfo.nameLast}</Typography>
              <Typography>Email: {userInfo.emailAddress}</Typography>
              {/* Add more user info fields as needed */}
            </Stack>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
