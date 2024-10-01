import React from "react";
import Head from 'next/head';
import { useRouter } from "next/router";
import { Button, Card, CardContent, Stack, Typography, FormControl, Label, TextField } from '@mui/material'
import { useState } from "react";
import { logging } from "../../next.config";
import { Dropdown } from "@mui/base";

export default function LoginPage() {
    const router = useRouter();

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prevState => ({...prevState, [name]: value}));
    };
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const handleSubmit = async (e) => {
        e.preventDefault();

        try{
            const response = await fetch("http://localhost:8080/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    emailAddress: formData.email,
                    password: formData.password,
                    accountType: formData.accountType,
                    profilePicPath: null
                })
            });

        const result = await response.json();

        if(response.ok){
            alert("Login Successfull!");
            // router.push("/profile");
            router.push(`/profile/${userId}`);
        }else{
            alert(`Login failed: ${result.message}`);
        }
    } catch(error){
        console.error("Error: ", error);
        alert("An error occured during login.");
    }
    };
    // const testEndpoint = () => {
    //     // const url = `http://localhost:8080/login`; //Just specific for this test endpoint
    //     const url = `http://localhost:8080/login`; //Just specific for this test endpoint

    //     fetch(url)
    //         .then(response => {
    //             if (!response.ok) {
    //                 throw new Error("Network response was not ok");
    //             }
                
    //             return response.text(); //Just using plain text for this simple test
    //         })
    //         .then(data => {
    //             setTestShow(data);
    //             router.push(`/profile/${userId}`)
    //         })
    //         .catch(error => console.error("Error fetching test data:", error));
    // };

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
                    <form onSubmit={handleSubmit}>

                    <div>
                        <input type="radio" id="Owner" name="accountType" value="Owner" checked />
                        <label for="Owner">Pet Owner</label>
                    </div>

                    <div>
                        <input type="radio" id="Center" name="accountType" value="Center" />
                        <label for="Center">Adoption Center</label>
                    </div>

                    <TextField fullWidth label='Email' name="email" size="small" margin="dense" value={formData.email} onChange={handleChange}/>
                    <TextField fullWidth label='Password' name="password" type="password" size="small" margin="dense" value={formData.password} onChange={handleChange}/>
                    <Button type='submit' variant='contained' color='primary'>Login</Button>
                    {/* <Button variant='contained' onClick={()=>router.push("/login")}>Back</Button> */}


                    </form>
                    {/* <Typography variant='body1' color='text.prima'>{testShow}</Typography> */}
                </Stack>

            </main >
        </>
    );
}