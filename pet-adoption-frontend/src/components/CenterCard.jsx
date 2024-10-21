import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function CenterCard(props) {
  const { center } = props;

  return (
    <Card
      key={center.id}
      sx={{
        display: "flex",
        mb: 2,
        width: "100%",
        minWidth: "500px",
      }}
    >
      <CardContent>
        <Box
          sx={{
            width: "100%%",
            minWidth: "200px",
            height: "200px",
            overflow: "hidden",
          }}
        >
          <img
            style={{
              width: "100%",
              maxHeight: "100%",
              borderRadius: "2%",
              objectFit: "cover",
            }}
            alt="Center Photo"
            src={`${apiUrl}/api/images/users/${center.id}/profile`}
          />
        </Box>
      </CardContent>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
            }}
          >
            <Typography variant="h4">{center.name}</Typography>
            <Typography variant="h6" color="textSecondary">
              {center.address}
            </Typography>
            <Typography variant="h6" color="textSecondary">
              {center.city}, {center.state}, {center.zipCode}
            </Typography>
            <Typography variant="body1">{center.description}</Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
