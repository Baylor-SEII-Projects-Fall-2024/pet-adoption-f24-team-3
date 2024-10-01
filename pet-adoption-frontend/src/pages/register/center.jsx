import React, {useState} from "react";
import Head from 'next/head';
import { useRouter } from "next/navigation";
import { Grid, Paper, Avatar, Typography, TextField, Button } from '@mui/material'

export default function RegisterCenterPage() {
    const router = useRouter();

    const paperStyle={padding: '30px 20px', width:300, margin:"20px auto"}
    const headerStyle={margin:0}

    const [formData, setFormData] = useState({
        centerName: "",
        email: "",
        address: "",
        city: "",
        state: "",
        zip: "",
        password: "",
        confirmPassword: "",
    });

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prevState => ({...prevState, [name]: value}));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const emptyFields = Object.keys(formData).filter(key => !formData[key]);

        if (emptyFields.length > 0) {
            const emptyFieldNames = emptyFields.map(field => {
                switch(field) {
                    case 'centerName': return 'Center Name';
                    case 'email': return 'Email';
                    case 'address': return 'Address';
                    case 'city': return 'City';
                    case 'state': return 'State';
                    case 'zip': return 'Zip Code';
                    case 'password': return 'Password';
                    case 'confirmPassword': return 'Confirm Password';
                    default: return field;
                }
            });
            alert(`Please fill in the following fields: ${emptyFieldNames.join(', ')}`);
            return;
        }

        if(formData.password != formData.confirmPassword){
            alert("Passwords do not match!");
            return;
        }

        try{
            const response = await fetch("http://localhost:8080/api/centers", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    accountType: "Center",
                    emailAddress: formData.email,
                    password: formData.password,
                    profilePicPath: null,
                    name: formData.centerName,
                    address: formData.address,
                    city: formData.city,
                    state: formData.state,
                    zipCode: formData.zip,
                    description: "A safe haven for homeless pets",
                    bannerPicPath: null
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
                    <TextField fullWidth label='Center Name' name="centerName" size="small" margin="dense" value={formData.centerName} onChange={handleChange}/>
                    <TextField fullWidth label='Email' name="email" size="small" margin="dense" value={formData.email} onChange={handleChange}/>
                    <TextField fullWidth label='Address' name="address" size="small" margin="dense" value={formData.address} onChange={handleChange}/>
                    <TextField fullWidth label='City' name="city" size="small" margin="dense" value={formData.city} onChange={handleChange}/>
                    <TextField fullWidth label='State' name="state" size="small" margin="dense" value={formData.state} onChange={handleChange}/>
                    <TextField fullWidth label='Zip Code' name="zip" size="small" margin="dense" value={formData.zip} onChange={handleChange}/>
                    <TextField fullWidth label='Password' name="password" type="password" size="small" margin="dense" value={formData.password} onChange={handleChange}/>
                    <TextField fullWidth label='Confirm Password' name="confirmPassword" type="password" size="small" margin="dense" value={formData.confirmPassword} onChange={handleChange}/>
                    <Button type='submit' variant='contained' color='primary'>Register</Button>
                    <Button variant='contained' onClick={()=>router.push("/register")}>Back</Button>


                </form>
            </Paper>
        </Grid>
    )
}