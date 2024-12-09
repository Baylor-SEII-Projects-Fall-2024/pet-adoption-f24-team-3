import React from "react";
import { List, ListItem, ListItemIcon, ListItemText, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

const PasswordChecker = ({ password }) => {
    const checks = [
        {
            label: "At least 8 characters",
            test: (pwd) => pwd.length >= 8,
        },
        {
            label: "At least one uppercase letter",
            test: (pwd) => /[A-Z]/.test(pwd),
        },
        {
            label: "At least one lowercase letter",
            test: (pwd) => /[a-z]/.test(pwd),
        },
        {
            label: "At least one number",
            test: (pwd) => /\d/.test(pwd),
        },
        {
            label: "At least one special character (!@#$%^&* etc.)",
            test: (pwd) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
        },
        {
            label: "No spaces",
            test: (pwd) => !/\s/.test(pwd),
        },
    ];

    const allPassed = checks.every((check) => check.test(password));

    if (!password || password.length < 1) return "";

    return (
        <div style={{ maxWidth: 400, margin: "0 auto" }}>
            <Typography variant="h6">
                Password Requirements
            </Typography>
            <List>
                {checks.map((check, index) => (
                    <ListItem key={index} style={{ padding: 0 }}>
                        <ListItemIcon>
                            {check.test(password) ? (
                                <CheckCircleIcon style={{ color: "green" }} />
                            ) : (
                                <CancelIcon style={{ color: "red" }} />
                            )}
                        </ListItemIcon>
                        <ListItemText primary={check.label} />
                    </ListItem>
                ))}
            </List>
            <Typography
                variant="subtitle1"
                style={{
                    color: allPassed ? "green" : "red",
                    fontWeight: "bold",
                    textAlign: "center",
                }}
            >
                {allPassed ? "Great Password!" : "Password does not meet the security requirements. "}
            </Typography>
        </div>
    );
};


export default PasswordChecker;