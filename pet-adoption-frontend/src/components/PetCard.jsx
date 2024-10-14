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
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Avatar
            variant="rounded"
            sx={{
              width: "100%",
              height: "100%",
              border: "2px solid #000",
              mt: 1,
              mb: 1,
            }}
            alt="Pet Avatar"
            src={"/defaults/pet.png"}
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
