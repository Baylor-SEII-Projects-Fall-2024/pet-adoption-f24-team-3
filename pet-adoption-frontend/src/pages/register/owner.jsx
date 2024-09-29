import React from "react";
import Head from 'next/head';
import { useRouter } from "next/navigation";
import { Grid, Paper, Avatar, Typography, TextField, Button } from '@mui/material'
//import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';

export default function RegisterOwnerPage() {
    const router = useRouter();

    const paperStyle={padding: '30px 20px', width:300, margin:"20px auto"}
    const headerStyle={margin:0}
    const avatarStyle={backgroundColor:'#c5a5bf'}

    return (
        <Grid>
            <Paper elevation={20} style={paperStyle}>
                <Grid align='center'>
                    
                    <h2 style={headerStyle}>Register</h2>
                    <Typography variant="caption">Please fill this form to create an account!</Typography>
                </Grid>
                <form>
                    <TextField fullWidth label='First Name' size="small" margin="dense"/>
                    <TextField fullWidth label='Last Name' size="small" margin="dense"/>
                    <TextField fullWidth label='Email' size="small" margin="dense"/>
                    <TextField fullWidth label='Username' size="small" margin="dense"/>
                    <TextField fullWidth label='Password' size="small" margin="dense"/>
                    <TextField fullWidth label='Confirm Password' size="small" margin="dense"/>
                    <Button type='submit' variant='contained' color='primary'>Register</Button>

                </form>
            </Paper>
        </Grid>
    )
}