/**
 * File: pets/new.jsx
 * Author: Icko Iben
 * Date Created: 09/24/2024
 * Date Last Modified: 09/24/2024
 * */

import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Button, Card, CardContent, Stack, Typography } from '@mui/material';

export default function PetsPage() {
  const router = useRouter();
  // const { userId } = router.query; //get user ID from the routing

  return (
    <>
      <Head>
        <title>New Pet Post</title>
      </Head>

      <main>
        <Stack sx={{ paddingTop: 4 }} alignItems='center' gap={2}>
          <Card sx={{ width: 600 }} elevation={4}>
            <CardContent>
              <Typography variant='h3' align='center'>New Pet Post</Typography>
              <Typography variant='body1' color='text.secondary'>This is where a center creates a new post for a pet.</Typography>
            </CardContent>
          </Card>
          <Stack direction="column">
            {/*
            <Button variant='contained' onClick={() => router.push(`/profile/${userId}/preferences`)} sx={{ width: 200 }}>Edit Preferences</Button>
            <Button variant='contained' onClick={() => router.push('/')} sx={{ width: 200 }}>Return Home</Button>
            */}
          </Stack>
        </Stack>
      </main>
    </>
  );
}
