import React from "react";
import Head from 'next/head';
import { useRouter } from "next/router";
import { Button, Card, CardContent, Stack, Typography, TextField } from '@mui/material'
import { useState } from "react";
import userService from "@/utils/services/userService";

export default function LoginPage() {
    const router = useRouter();
    const { validateLogin } = userService();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    //handle what happens on sumbmit. Does not reroute on success.
    const handleSubmit = async (e) => {
        e.preventDefault();

        await validateLogin(formData.email, formData.password)
            .then((userId) => {
                //if user id is not null, that is handled in the hook below
                if (userId !== null) {
                    router.push(`/profile/${userId}`);
                }
                else {
                    let elm = document.getElementById("errorLabel");
                    elm.innerHTML = "Invalid credentials!";
                    elm.style = "color: red;"
                }
            })
            .catch((error) => {
                let elm = document.getElementById("errorLabel");
                elm.innerHTML = "Invalid credentials!";
                elm.style = "color: red;"
                console.error("Error logging in:", error);
            });
    };

    return (
        <>
            <Head>
                <title>Log In</title>
            </Head>

            <main>
                <Stack sx={{ paddingTop: 4 }} alignItems='center' gap={2}>
                    <Card sx={{ width: 600 }} elevation={4}>
                        <CardContent>
                            <Typography variant='h3' align='center'>WOOF - Log In</Typography>
                            <Typography variant='body1' align='center' color='text.secondary'>Welcome back! Fill in the information below to log in</Typography>

                            <form onSubmit={handleSubmit}>
                                <TextField fullWidth label='Email' name="email" size="small" margin="dense" value={formData.email} onChange={handleChange} />
                                <TextField fullWidth label='Password' name="password" type="password" size="small" margin="dense" value={formData.password} onChange={handleChange} />
                                <Button type='submit' variant='contained' color='primary'>Login</Button>
                            </form>
                            <label id="errorLabel"></label>
                        </CardContent>
                    </Card>
                </Stack>

            </main >
        </>
    );
}