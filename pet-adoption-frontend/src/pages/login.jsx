import React from "react";
import Head from 'next/head';
import { useRouter } from "next/router";
import { Button, Card, CardContent, Stack, Typography } from '@mui/material'

export default function LoginPage() {
    const router = useRouter();

    return (
        <>
            <Head>
                <title>Login Page</title>
            </Head>

            <main>
            <Stack sx={{ paddingTop: 4 }} alignItems='center' gap={2}>
                <Card sx={{ width: 600 }} elevation={4}>
                    <CardContent>
                        <Typography variant='h3' align='center'>Login Page</Typography>
                        <Typography variant='body1' color='text.secondary'>This is where a User, either owner or center, can login.</Typography>
                    </CardContent>
                </Card>
            </Stack>
            </main>
        </>
    );
}