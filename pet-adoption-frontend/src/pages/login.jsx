import React from "react";
import Head from 'next/head';
import { useRouter } from "next/router";
import {
  Button,
  Card,
  CardContent,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import {
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { useState } from "react";
import userService from "@/utils/services/userService";

export default function LoginPage() {
  const router = useRouter();
  const { validateLogin } = userService();

  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormError(null);
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  }

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
          setFormError("Invalid credentials!");
        }
      })
      .catch((error) => {
        setFormError("Invalid credentials!");
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

                <TextField
                  fullWidth
                  label='Email'
                  name="email"
                  size="small"
                  margin="dense"
                  value={formData.email}
                  onChange={handleChange}
                />

                <TextField
                  fullWidth
                  label='Password'
                  name="password"
                  type={showPassword ? "text" : "password"}
                  size="small"
                  margin="dense"
                  value={formData.password}
                  onChange={handleChange}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleTogglePasswordVisibility}>
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />

                <Button type='submit' variant='contained' color='primary'>Login</Button>
              </form>
              {formError && (<Typography color="error">{formError}</Typography>)}
            </CardContent>
          </Card>
        </Stack>

      </main >
    </>
  );
}
