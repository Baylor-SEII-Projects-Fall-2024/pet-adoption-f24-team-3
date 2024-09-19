import React from "react";
import Head from 'next/head';
import { useRouter } from "next/navigation";
import { Button, Card, CardContent, Stack, Typography } from '@mui/material'

export default function ReisterPage() {
    const router = useRouter();

    return (
        <>
            <Head>
                <title>Register Page</title>
            </Head>

            <main>
            <Stack sx={{ paddingTop: 4 }} alignItems='center' gap={2}>
                <Card sx={{ width: 600 }} elevation={4}>
                    <CardContent>
                        <Typography variant='h3' align='center'>Register Page</Typography>
                        <Typography variant='body1' color='text.secondary'>This is where a User, either owner or center, can register a new account.</Typography>
                    </CardContent>
                </Card>
            </Stack>
            </main>
        </>
    );
}