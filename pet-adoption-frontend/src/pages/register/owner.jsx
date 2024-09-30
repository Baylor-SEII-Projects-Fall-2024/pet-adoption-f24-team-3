import React, {useState} from "react";
import Head from 'next/head';
import { useRouter } from "next/navigation";
import { Grid, Paper, Avatar, Typography, TextField, Button, useScrollTrigger } from '@mui/material'
//import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';

export default function RegisterOwnerPage() {
    const router = useRouter();

    const paperStyle={padding: '30px 20px', width:300, margin:"20px auto"}
    const headerStyle={margin:0}

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
    });

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prevState => ({...prevState, [name]: value}));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(formData.password != formData.confirmPassword){
            alert("Passwords do not match!");
            return;
        }

        try{
            const response = await fetch("http://localhost:8080/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    emailAddress: formData.email,
                    password: formData.password,
                    accountType: "Owner",
                    profilePicPath: null
                })
            });

        const result = await response.json();

        if(response.ok){
            alert("Registration Successfull!");
            //router.push("/login");
        }else{
            alert(`Registration failed: ${result.message}`);
        }
    } catch(error){
        console.error("Error: ", error);
        alert("An error occured during registration.");
    }
    };


    return (
        <Grid>
            <Paper elevation={20} style={paperStyle}>
                <Grid align='center'>
                    
                    <h2 style={headerStyle}>Register</h2>
                    <Typography variant="caption">Please fill this form to create an account!</Typography>
                </Grid>
                <form onSubmit={handleSubmit}>
                    <TextField fullWidth label='First Name' name="firstName" size="small" margin="dense" value={formData.firstName} onChange={handleChange}/>
                    <TextField fullWidth label='Last Name' name="lastName" size="small" margin="dense" value={formData.lastName} onChange={handleChange}/>
                    <TextField fullWidth label='Email' name="email" size="small" margin="dense" value={formData.email} onChange={handleChange}/>
                    <TextField fullWidth label='Username' name="username" size="small" margin="dense" value={formData.username} onChange={handleChange}/>
                    <TextField fullWidth label='Password' name="password" type="password" size="small" margin="dense" value={formData.password} onChange={handleChange}/>
                    <TextField fullWidth label='Confirm Password' name="confirmPassword" type="password" size="small" margin="dense" value={formData.confirmPassword} onChange={handleChange}/>
                    <Button type='submit' variant='contained' color='primary'>Register</Button>
                    <Button variant='contained' onClick={()=>router.push("/register")}>Back</Button>


                </form>
            </Paper>
        </Grid>
    )
}