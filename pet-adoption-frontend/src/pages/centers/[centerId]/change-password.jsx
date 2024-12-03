import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import {
    Alert,
    Button,
    Card,
    CardContent,
    IconButton,
    InputAdornment,
    Snackbar,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import {
    Visibility,
    VisibilityOff,
} from "@mui/icons-material";
import { useSelector } from "react-redux";

import userService from "@/utils/services/userService";

export default function ChangePassword() {
    const router = useRouter();
    const { centerId } = router.query; // get user ID from the routing
    const currentUserId = useSelector((state) => state.currentUser.currentUserId); // get the current session user
    const { checkOldPasswordAndChange } = userService();

    const [showPassword, setShowPassword] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [formError, setFormError] = useState(null);
    const [formSuccess, setFormSuccess] = useState();
    const [formData, setFormData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    const handleTogglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    }

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({ ...prevState, [name]: value }));

        // Check if passwords match
        if (name === "newPassword" || name === "confirmPassword") {
            setPasswordError(
                name === "newPassword"
                    ? value !== formData.confirmPassword
                    : formData.newPassword !== value
            );
        }
    };

    //handle what happens on sumbmit. Does not reroute on success.
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if the new password and confirm password match
        if (formData.newPassword !== formData.confirmPassword) {
            setFormError("New passwords do not match");
            return;
        }

        const result = await checkOldPasswordAndChange(formData, centerId);

        if (result.success) {
            setSnackbarMessage(result.message);
            setSnackbarOpen(true);
            setFormError(null);

            // Delay re-routing for 1.5 seconds
            setTimeout(() => {
                router.push(`/centers/${centerId}`);
            }, 1500);
        } else {
            // If the password change fails, show the error message
            setFormError(result.message);
            setFormSuccess(null);  // Clear any previous success messages
        }
    };

    const handleCancel = () => {
        router.push(`/centers/${centerId}`);
    }

    useEffect(() => {
        if (centerId && centerId != currentUserId) {
            router.push(`/centers/${centerId}`);
        }
    }, [centerId, currentUserId, router]); // rerender if centerId changes

    return (
        <>
            <Head>
                <title>Change Password</title>
            </Head>

            <main>
                <Stack sx={{ paddingTop: 4 }} alignItems="center" gap={2}>
                    <Card sx={{ width: 600 }} elevation={4}>
                        <CardContent>
                            <Typography variant="h3" align="center">
                                Change Password
                            </Typography>
                        </CardContent>
                    </Card>
                    <Stack direction="column">
                        <Card sx={{ minWidth: "60vw", p: "15px" }}>
                            <form onSubmit={handleSubmit}>

                                <TextField
                                    required
                                    fullWidth
                                    label="Old Password"
                                    name="oldPassword"
                                    size="small"
                                    margin="dense"
                                    type={showPassword ? "text" : "password"}
                                    value={formData.oldPassword}
                                    onChange={handleFormChange}
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
                                    required
                                    fullWidth
                                    label="New Password"
                                    name="newPassword"
                                    size="small"
                                    margin="dense"
                                    type={showPassword ? "text" : "password"}
                                    value={formData.newPassword}
                                    onChange={handleFormChange}
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
                                    required
                                    fullWidth
                                    label="Confirm New Password"
                                    name="confirmPassword"
                                    size="small"
                                    margin="dense"
                                    type={showPassword ? "text" : "password"}
                                    value={formData.confirmPassword}
                                    onChange={handleFormChange}
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

                                <br></br>

                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                >
                                    Save
                                </Button>

                                <Button
                                    type="cancel"
                                    variant="contained"
                                    color="primary"
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </Button>

                            </form>

                            {formError && (
                                <Typography color="error">{formError}</Typography>
                            )}

                            {formSuccess && (
                                <Typography color="success">{formSuccess}</Typography>
                            )}
                        </Card>
                    </Stack>
                </Stack>

                {/* Snackbar for success message */}
                <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={1500}
                    onClose={() => setSnackbarOpen(false)}
                >
                    <Alert
                        onClose={() => setSnackbarOpen(false)}
                        severity="success"
                        sx={{ width: "100%" }}
                    >
                        {snackbarMessage}
                    </Alert>
                </Snackbar>

            </main>
        </>
    )
}
