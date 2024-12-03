import React from 'react';
import Head from 'next/head'
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { Button, Card, CardContent, Stack, Typography, Box } from '@mui/material'
import styles from '@/styles/Home.module.css'

export default function HomePage() {
  const router = useRouter();
  const currentUserId = useSelector((state) => state.currentUser.currentUserId);

  const onButtonPress = () => {
    alert('You pressed a button!');
  }

  return (
    <>
      <Head>
        <title>Home Page</title>
      </Head>

      <main>
        <Stack alignItems='center' gap={2}>
          <div>
          <Box
            sx={{
              position: "relative",
              width: "100%",
              height: "50vh"
            }}
          >
            <img className="fade-in"
              style={{
                width: "100vw",
                height: "50vh",
                objectFit: "cover",
              }}
              src={"homescreen_header.jpg"}
            />
            <div className="fade-in-faster">
            <Typography variant='h1' color='text.white'
              sx={{
                position: "absolute",
                left: 0,
                right: 0,
                top: "50%",
                transform: "translateY(-50%)",
                textAlign: "center",
                textShadow: "#000 2px 1px 5px",
              }}
            >Find Your New Best Friend!</Typography>
            </div>
          </Box>
          </div>
          <div className="fade-in-faster">
          <Stack direction="column"
            sx={{
              mt: "30px",
              mb: "30px",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
            }}>
            <Typography variant='h2' align='center'>WOOF helps you find your ideal pet</Typography>
            <Typography variant='body1' color='text.secondary'>
                <strong>WOOF</strong> learns on the fly to quickly match you with your new best friend.
                <br />
                <strong>Sign up today</strong> to begin the search for the newest (<em>and cutest!</em>) member of your home!
                <br />
                You wouldn't want to condemn any of these forsaken pets to a life of unadoption, now, would you?
            </Typography>
            <Button variant='contained' color='secondary' onClick={() => router.push("/pets")} sx={{ width: 200, mt: "15px", fontSize: "20px"}}>Find Your Friend!</Button>
          </Stack>
          </div>

          <Card sx={{
            width: "80%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            pt: "5px",
            pb: "15px",
          }} elevation={4}>
            <CardContent>
              <img className="fade-in-faster"
                style={{
                  width: "60%",
                  borderRadius: "2%",
                  marginBottom: "10px",
                }}
                src={"homescreen_adopt.jpg"}
              />
              <Typography variant='h3' align='center'>Your local Adoption Centers. All in one place.</Typography>
              <Typography variant='body1' color='text.secondary'>We collaborate with local adoption centers in your area to bring you the widest selection of pets. Find events happening at your local shelter, and join our mission to find every pet a loving home!<br></br>Don't leave home without a new pet! Otherwise they would be so so sad...</Typography>
              <Stack direction="row" sx={{ justifyContent: "center" }}>
                <Button variant='contained' onClick={() => router.push("/events")} sx={{ width: 200 }}>Find Local Events</Button>
                <Button variant='contained' color='secondary' onClick={() => router.push("/centers")} sx={{ width: 200 }}>Find your Adoption Center</Button>
              </Stack>
            </CardContent>
          </Card>

          <Stack direction="column"
            sx={{
              mt: "30px",
              mb: "30px",
              width: "70%",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
            }}>
            <img
              style={{
                width: "70%",
                borderRadius: "2%",
                marginBottom: "10px",
              }}
              src={"homescreen_center.jpg"}
            />
            <Typography variant='h3' align='center'>Adoption Centers, Glad you're here!</Typography>
            <Typography variant='body1' color='text.secondary'>Join WOOF today and gain access to a platform for advertising your pets and upcoming events like no other!</Typography>
            <Button variant='contained' color='secondary' onClick={ currentUserId == null?() => router.push("/register"):()=>router.push("/pets")} sx={{ width: 200 }}>Start Here!</Button>
          </Stack>
        </Stack>
      </main >
    </>
  );
}
