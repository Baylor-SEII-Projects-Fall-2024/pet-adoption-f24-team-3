import React from 'react';
import Head from 'next/head'
import { useRouter } from 'next/router';
import { Button, Card, CardContent, Stack, Typography } from '@mui/material'

export default function EventDetails() {
  const router = useRouter();
  const { eventID } = router.query;

  return (
    <div>
      <Head>
        <title>Event Page</title>
      </Head>

      <main>
        <Stack sx={{ paddingTop: 4 }} alignItems='center' gap={2}>
          <Card sx={{ width: 600 }} elevation={4}>
            <CardContent>
              <Typography variant='h3' align='center'>Event Page - Event {eventID}</Typography>
              <Typography variant='body1' color='text.secondary'>This is where a user will be able to view all of the events.</Typography>
            </CardContent>
          </Card>
          <Stack direction="column">
            <Button variant='contained' onClick={() => router.push(`/events/${eventID}/edit`)} sx={{ width: 200 }}>Edit Event</Button>
            <Button variant='contained' onClick={() => router.push('/')} sx={{ width: 200 }}>Return Home</Button>
          </Stack>
        </Stack>
      </main>
    </div>
  );
}
