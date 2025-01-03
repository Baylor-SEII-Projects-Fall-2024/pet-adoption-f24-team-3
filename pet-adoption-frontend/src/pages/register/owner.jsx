import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from '@mui/material'
import {
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import userService from "@/utils/services/userService";
import PasswordChecker from "@/components/PasswordChecker";

export default function RegisterOwnerPage() {
  const router = useRouter();
  const { registerOwner } = userService();

  const passwordRegex = RegExp('[^ -~]');
  const usernameRegex = RegExp('[^ a-zA-Z]');

  const emailRegex = new RegExp('^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,6}$');

  const paperStyle = { padding: '30px 20px', width: "50%", margin: "20px auto" }
  const headerStyle = { margin: 0 }

  const [profileImage, setProfileImage] = useState(null);
  const [isUploading, setIsUploading] = useState(null);
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const handleSelectChange = (event, fieldName) => {
    const { value } = event.target;
    setFormData((prevState) => ({ ...prevState, [fieldName]: value }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormError(null);
    setFormSuccess(null);
    setFormData(prevState => ({ ...prevState, [name]: value }));

    // Check if passwords match
    if (name === "password" || name === "confirmPassword") {
      setPasswordError(
        name === "password"
          ? value !== formData.confirmPassword
          : formData.password !== value
      );
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  }

  const handleProfileImageUpload = (e) => {
    setProfileImage(e.target.files[0]);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emptyFields = Object.keys(formData).filter(key => !formData[key]);
    if (usernameRegex.test(formData.firstName) || usernameRegex.test(formData.lastName)) {
      setFormError("Name contains special characters!");
      return;
    }

    if (passwordRegex.test(formData.password)) {
      setFormError("Password has invalid characters!");
      return;
    }

    if (!emailRegex.test(formData.email)) {
      setFormError("Please submit a valid email!");
      return;
    }

    if (!isPasswordOwaspCompliant(formData.password)) {
      alert("Password does not meet the security requirements!");
      return;
    }

    if (formData.password != formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      setIsUploading(true);
      await registerOwner(formData, profileImage)
        .then(async (result) => {
          if (result !== null) {
            setIsUploading(false);
            router.push(`/pets`);
          }
        });
    } catch (error) {
      console.error("Error: ", error);
      alert("An error occured during registration.");
    }
  };

  const isPasswordOwaspCompliant = (password) => {
    const checks = [
      (pwd) => pwd.length >= 8, // At least 8 characters
      (pwd) => /[A-Z]/.test(pwd), // At least one uppercase letter
      (pwd) => /[a-z]/.test(pwd), // At least one lowercase letter
      (pwd) => /\d/.test(pwd), // At least one number
      (pwd) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd), // At least one special character
      (pwd) => !/\s/.test(pwd), // No spaces
    ];

    return checks.every((check) => check(password));
  };

  return (
    <Grid>
      <Paper elevation={20} style={paperStyle}>
        <Grid align='center'>
          <h2 style={headerStyle}>Register</h2>
          <Typography variant="caption">Please fill this form to create an account!</Typography>
        </Grid>

        <form onSubmit={handleSubmit}>
          <TextField required fullWidth label='First Name' name="firstName" size="small" margin="dense" value={formData.firstName} onChange={handleChange} />
          <TextField required fullWidth label='Last Name' name="lastName" size="small" margin="dense" value={formData.lastName} onChange={handleChange} />
          <TextField required fullWidth label='Email' name="email" size="small" margin="dense" value={formData.email} onChange={handleChange} />

          <TextField
            required
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

          <PasswordChecker password={formData.password} />

          <TextField
            required
            fullWidth
            label='Confirm Password'
            name="confirmPassword"
            type={showPassword ? "text" : "password"}
            size="small"
            margin="dense"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={passwordError}
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

          <TextField
            type="file"
            label='Profile Picture'
            name="profilePicture"
            size="small" margin="dense"
            InputLabelProps={{ shrink: true }}
            inputProps={{ accept: "image/png, image/gif, image/jpeg" }}
            onChange={handleProfileImageUpload} />
          <br></br>
          {isUploading ?
            <Typography> Creating Account...</Typography>
            :
            <Button type='submit' variant='contained' color='primary'>Register</Button>
          }
          <Button variant='contained' onClick={() => router.push("/register")}>Back</Button>

        </form>
        {formError && (
          <Typography color="error">{formError}</Typography>
        )}
        {formSuccess && (
          <Typography color="success">{formSuccess}</Typography>
        )}
      </Paper>
    </Grid>
  )
}
