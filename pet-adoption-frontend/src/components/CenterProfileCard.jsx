import * as React from "react";
import { useRouter } from "next/router";
import {
  Card,
  Box,
  Grid,
  CardContent,
  Typography,
  Button,
  Avatar,
} from "@mui/material";
import formatter from "@/utils/formatter";

export default function CenterProfileCard(props) {
  const propsNotInInfo = [
    "bannerPicPath",
    "profilePicPath",
    "name",
    "password",
    "id",
    "description",
  ];
  const router = useRouter();
  const { centerInfo, centerId, currentUserId } = props;
  const { camelCaseToReadable } = formatter();

  const handleEditInfoClick = () => {
    router.push(`/centers/edit`);
  };

  return (
    <Box>
      {/* Create card to display centers name and avatar */}
      <Card
        sx={{
          margin: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 4,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            width: "100%",
          }}
        >
          {/* Display edit button if user is viewing their own page */}
          {String(centerId) === String(currentUserId) && (
            <Button
              variant="contained"
              color="secondary"
              sx={{
                padding: "12px 12px",
                fontSize: "14px",
                minWidth: "150px",
              }}
              onClick={handleEditInfoClick}
            >
              Edit Info
            </Button>
          )}
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            mb: 4,
            width: "100%",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Flex box containing profile info and center avatar */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "40%",
            }}
          >
            <Typography variant="h4">{centerInfo.name}</Typography>
            {/* Display centers avatar */}
            <Avatar
              sx={{
                bgcolor: "#a3b18a",
                width: 175,
                height: 175,
                border: "2px solid #000",
                mt: 2,
              }}
              alt="Center Avatar"
              src=""
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              width: "100%",
            }}
          >
            <CardContent>
              {/* Info */}
              {centerInfo && (
                <>
                  <Grid container spacing={2}>
                    {Object.entries(centerInfo).map(([key, value]) => {
                      if (!propsNotInInfo.includes(key)) {
                        return (
                          <Grid item xs={12} sm={4} md={4} key={key}>
                            <Typography variant="body1" color="textSecondary">
                              {`${camelCaseToReadable(key)}: ${
                                value === null ? "N/A" : value
                              }`}
                            </Typography>
                          </Grid>
                        );
                      }
                    })}
                  </Grid>
                </>
              )}
            </CardContent>
          </Box>
        </Box>

        <Box
          sx={{
            width: "100%",
          }}
        >
          <Typography variant="body1" align="left">
            {centerInfo.description}
          </Typography>
        </Box>
      </Card>
    </Box>
  );
}
