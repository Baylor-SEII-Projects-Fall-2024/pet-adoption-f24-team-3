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

export default function TabPetCard(props) {
  const { pet } = props;
  const attributesExcluded = [
    "id",
    "picPath",
    "name",
    "description",
    "centerId",
  ];
  const { camelCaseToReadable, formatSize } = formatter();
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Box>
      <Card
        key={pet.id}
        sx={{
          mb: 2,
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
            <Typography variant="h5">{pet.name}</Typography>
            <Avatar
              variant="rounded"
              sx={{
                width: "90%",
                height: "90%",
                border: "2px solid #000",
                mt: 1,
                mb: 1,
              }}
              alt="Pet Avatar"
              src={pet.picPath ? pet.picPath : "/defaults/pet.png"}
            />
          </Box>
          <Box>
            <Typography align="center" variant="body1" color="textSecondary">
              {pet.description}
            </Typography>
            <Button onClick={handleExpandClick}>
              {expanded ? "Less" : "More"}
            </Button>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
              <Box>
                {Object.entries(pet).map(([key, value]) => {
                  if (!attributesExcluded.includes(key)) {
                    return (
                      <Box key={key} sx={{ mb: 2 }}>
                        <Typography variant="body2" color="textSecondary">
                          {`${camelCaseToReadable(key)}: ${
                            key === "datePosted"
                              ? format(new Date(value), "MMMM dd, yyyy")
                              : value === null
                              ? "N/A"
                              : key === "size"
                              ? formatSize(value)
                              : value
                          }`}
                        </Typography>
                      </Box>
                    );
                  }
                  return null;
                })}
              </Box>
            </Collapse>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
