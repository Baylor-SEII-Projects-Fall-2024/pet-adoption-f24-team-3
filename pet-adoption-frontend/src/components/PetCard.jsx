import React, { useState } from "react";
import formatter from "@/utils/formatter";
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
import { format } from "date-fns";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;


export default function PetCard(props) {
  const { pet } = props;

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
          }}
        >
          <img
            style={{
              width: "100%",
              height: "auto",
              borderRadius: "2%",

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
            {pet.sex} {pet.breed}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
