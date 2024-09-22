import React from "react";
import Head from 'next/head';
import { useRouter } from "next/router";
import { Button, Card, CardContent, Stack, Typography } from '@mui/material'
import { useState } from "react";
import { logging } from "../../next.config";

export default function LoginPage() {
    const router = useRouter();

    const [testShow, setTestShow] = useState("This is a test button")

    const testEndpoint = () =>{
        const url = "http://localhost:8080/test"; //Just specific for this test endpoint
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.text(); //Just using plain text for this simple test
            })
            .then(data => {
                setTestShow(data); 
            })
            .catch(error => console.error("Error fetching test data:", error));
    };

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
            <Stack direction="column">
                <Button variant='contained' onClick={testEndpoint}>{testShow} </Button>
            </Stack>
            </main>
        </>
    );
}