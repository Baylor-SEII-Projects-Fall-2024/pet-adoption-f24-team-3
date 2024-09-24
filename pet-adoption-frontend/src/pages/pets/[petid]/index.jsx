import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Button, Card, CardContent, Stack, Typography } from '@mui/material'

export default function ViewPetPage() {
  const router = useRouter();
  const { petId } = router.query; //get pet ID from the routing

  return (
    <>
      <Head>
        <title>View Pet</title>
      </Head>

      <main>
        <Stack sx={{ paddingTop: 4 }} alignItems='center' gap={2}>
          <Card sx={{ width: 600 }} elevation={4}>
            <CardContent>
              <Typography variant='h3' align='center'>View Pet - {petId}</Typography>
              <Typography variant='body1' color='text.secondary'>This is where a user will be able to view all their profile details and preferences.</Typography>
            </CardContent>
          </Card>
          <Stack direction="column">
            <Button variant='contained' onClick={() => router.push(`/pets/${petId}/edit`)} sx={{ width: 200 }}>Edit Pet</Button>
            <Button variant='contained' onClick={() => router.push('/')} sx={{ width: 200 }}>Return Home</Button>
          </Stack>
        </Stack>
      </main>
    </>
  );
}
