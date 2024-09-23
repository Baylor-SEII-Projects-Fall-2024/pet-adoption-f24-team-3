import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Button, Card, CardContent, Stack, Typography } from '@mui/material'

export default function EditProfilePage() {
  const router = useRouter();
  const { userId } = router.query; //get user ID from the routing

  return (
    <>
      <Head>
        <title>Edit Profile Page</title>
      </Head>

      <main>
        <Stack sx={{ paddingTop: 4 }} alignItems='center' gap={2}>
          <Card sx={{ width: 600 }} elevation={4}>
            <CardContent>
              <Typography variant='h3' align='center'>Edit Pet Page</Typography>
              <Typography variant='body1' color='text.secondary'>This is where user {userId} will be able to edit the pet details.</Typography>
            </CardContent>
          </Card>
        </Stack>
      </main>
    </>
  );
}
