import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Button, Card, CardContent, Stack, Typography } from '@mui/material'

export default function ProfilePage() {
  const router = useRouter();
  const { userId } = router.query; //get user ID from the routing

  return (
    <>
      <Head>
        <title>Centers Page</title>
      </Head>

      <main>
        <Stack sx={{ paddingTop: 4 }} alignItems='center' gap={2}>
          <Card sx={{ width: 600 }} elevation={4}>
            <CardContent>
              <Typography variant='h3' align='center'>Profile Page - User {userId}</Typography>
              <Typography variant='body1' color='text.secondary'>This is where a user will be able to view all their profile details and preferences.</Typography>
            </CardContent>
          </Card>
        </Stack>
      </main>
    </>
  );
}
