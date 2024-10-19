import React, { useState } from "react";

import {
    Box, Typography
} from "@mui/material";


export default function Loading(props) {
    const { doneLoading } = props;

    if (doneLoading) return;

    return (
        <Box
            sx={{
                width: "100%",
                textAlign: "center",
                height: "200px",
            }}
        >
            <Typography variant="h4" color="text.secondary">Loading...</Typography>
        </Box>
    );
}
