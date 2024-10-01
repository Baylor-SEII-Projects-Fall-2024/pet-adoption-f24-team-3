import React from "react";
import Head from 'next/head';
import { useRouter } from "next/navigation";
import { Button, Card, CardContent, Stack, Typography, ButtonGroup, ToggleButtonGroup, ToggleButton, Grid } from '@mui/material'

export default function RegisterPage() {
    const router = useRouter();
    const [alignment, setAlignment] = React.useState('owner');

    const handleChange = (event, newAlignment) => {
        if (newAlignment !== null) {
            setAlignment(newAlignment);
          }
    };

    return (
        <>
            <Head>
                <title>Choose Account Type</title>
            </Head>

            <main>
            <Stack sx={{ paddingTop: 4 }} alignItems='center' gap={2}>
                <Card sx={{ width: 600 }} elevation={4}>
                    <CardContent>
                        <Typography variant='h3' align='center'>Account Registration</Typography>
                        <Typography variant='body1' color='text.secondary' align="center">Please select your account type!</Typography>
                        <Grid align='center'>
                            <Button variant='contained' onClick={()=>router.push("/register/owner")} sx={{ width: 200 }}>Pet Owner</Button>
                            <Button variant='contained' onClick={()=>router.push("/register/center")} sx={{ width: 200 }}>Adoption Center</Button>
                            <Button variant='contained' onClick={() => router.push('/')} sx={{ width: 200 }}>Return Home</Button>
                        </Grid>
                    </CardContent>
                </Card>
            </Stack>
            </main>
        </>
    );
}