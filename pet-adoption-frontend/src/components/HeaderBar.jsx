import React from "react";
import { useRouter } from "next/router";
import { Button, AppBar, Container, Typography, Toolbar } from '@mui/material'

export default function HeaderBar() {
    const router = useRouter();

    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar>
                    <Typography variant="h3">WOOF</Typography>
                    <Typography>We need to PLEASE define our styles soon</Typography>
                    <Button variant='contained' onClick={() => router.push(`/profile/MakeMeFunctional`)} sx={{ width: 200 }}>Profile</Button>
                </Toolbar>
            </Container>
        </AppBar>
    );
}