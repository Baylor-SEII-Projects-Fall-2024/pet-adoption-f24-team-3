import React from "react";

import { Box, Typography } from "@mui/material";

export default function Loading(props) {
  const { doneLoading, page } = props;

  if (doneLoading || page < 2) return;

  return (
    <Box
      sx={{
        width: "100%",
        textAlign: "center",
        height: "200px",
      }}
    >
      <Typography variant="h4" color="text.secondary">
        Loading...
      </Typography>
    </Box>
  );
}
