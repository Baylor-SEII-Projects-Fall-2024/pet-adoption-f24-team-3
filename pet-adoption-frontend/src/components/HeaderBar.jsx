import React from "react";
import { useRouter } from "next/router";
import { Button, AppBar, Container, Typography, Toolbar } from '@mui/material'

export default function HeaderBar(props) {
    const router = useRouter();
    console.log(props);
    const currentUserId = props?.currentUserId | null;

    const displayCurrentUser = () => {
        if (currentUserId) {
            return (
                <div>
                    <Typography>Welcome, {currentUserId}</Typography>
                    <Button variant='contained' color="secondary" onClick={() => router.push(`/profile/${currentUserId}`)} sx={{ width: 200 }}>Profile</Button>
                </div>
            );
        }
        else {
            return (
                <div>
                    <Button variant='contained' onClick={() => router.push(`/login`)} >Log In</Button>
                    <Button variant='contained' color="secondary" onClick={() => router.push(`/register`)}>Sign Up</Button>
                </div>

            );
        }
    }

    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar>
                    <Typography variant="h3">WOOF</Typography>
                    {displayCurrentUser()}
                </Toolbar>
            </Container>
        </AppBar>
    );
}