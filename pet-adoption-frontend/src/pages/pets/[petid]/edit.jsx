import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Button, Card, CardContent, Stack, Typography } from '@mui/material'

export default function EditPetPage() {
  const router = useRouter();
  const { petId } = router.query; //get user ID from the routing

  return (
    <>
      <Head>
        <title>Edit Pet</title>
      </Head>

      <main>
        <Stack sx={{ paddingTop: 4 }} alignItems='center' gap={2}>
          <Card sx={{ width: 600 }} elevation={4}>
            <CardContent>
              <Typography variant='h3' align='center'>Edit Pet - {petId}</Typography>
              <Typography variant='body1' color='text.secondary'>This is where a shelter will be able to edit the pet details.</Typography>
            </CardContent>
          </Card>
          <Stack direction="column">
            <Button variant='contained' onClick={() => router.push(`/pets/${petId}/`)} sx={{ width: 200 }}>View Pet</Button>
            <Button variant='contained' onClick={() => router.push('/')} sx={{ width: 200 }}>Return Home</Button>
          </Stack>
        </Stack>

      </main>
    </>
  );
}
