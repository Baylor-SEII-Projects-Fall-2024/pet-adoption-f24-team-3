import React, { useState } from "react";
import {
  Avatar,
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Collapse,
  Button,
} from "@mui/material";
import formatter from "@/utils/formatter";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function PetCard(props) {
  const { pet } = props;
  const { formatSex } = formatter();

  return (
    <Card
      key={pet.id}
      sx={{
        display: "flex",
        mb: 2,
        width: "100%",
      }}
    >
      <CardContent>
        <Box
          sx={{
            flex: 0.8,
            width: "100%",
            height: "300px",
            overflow: "hidden",
          }}
        >
          <img
            style={{
              width: "100%",
              maxHeight: "auto",
              borderRadius: "2%",
              aspectRatio: 1,
              objectFit: "cover",
            }}
            alt="Pet Photo"
            src={`${apiUrl}/api/images/animals/${pet.id}`}
          />
        </Box>
        <Box>
          <Typography variant="h5">
            {pet.name}, {pet.age}
          </Typography>
          <Typography>
            {formatSex(pet.sex)} {pet.breed}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
