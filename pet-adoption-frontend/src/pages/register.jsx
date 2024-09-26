import React from "react";
import Head from 'next/head';
import { useRouter } from "next/navigation";
import { Button, Card, CardContent, Stack, Typography, ButtonGroup, ToggleButtonGroup, ToggleButton } from '@mui/material'

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
                <title>Register Page</title>
            </Head>

            <main>
            <Stack sx={{ paddingTop: 4 }} alignItems='center' gap={2}>
                <Card sx={{ width: 600 }} elevation={4}>
                    <CardContent>
                        <Typography variant='h3' align='center'>Register Page</Typography>
                        <Typography variant='body1' color='text.secondary'>This is where a User, either owner or center, can register a new account.</Typography>
                        <ToggleButtonGroup
                            color="primary"
                            value={alignment}
                            exclusive
                            onChange={handleChange}
                            aria-label="Platform"
                            >
                                <ToggleButton value="owner">Potential Owner</ToggleButton>
                                <ToggleButton value="center">Adoption Center</ToggleButton>
                        </ToggleButtonGroup>
                    </CardContent>
                </Card>
            </Stack>
            </main>
        </>
    );
}