/**
 * File: pets/index.jsx
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

  return (
    <>
      <Head>
        <title>Pets Page</title>
      </Head>

      <main>
        <Stack sx={{ paddingTop: 4 }} alignItems='center' gap={2}>
          <Card sx={{ width: 600 }} elevation={4}>
            <CardContent>
              <Typography variant='h3' align='center'>Pets Page</Typography>
              <Typography variant='body1' color='text.secondary'>This is where a user can view a list of all pets.</Typography>
            </CardContent>
          </Card>
          <Stack direction="column">
            <Button variant='contained' onClick={() => router.push(`/pets/new`)} sx={{ width: 200 }}>New Pet</Button>
            <Button variant='contained' onClick={() => router.push(`/pets/MrMeow/`)} sx={{ width: 200 }}>Mr. Meow</Button>
            <Button variant='contained' onClick={() => router.push('/')} sx={{ width: 200 }}>Return Home</Button>

          </Stack>
        </Stack>
      </main>
    </>
  );
}
