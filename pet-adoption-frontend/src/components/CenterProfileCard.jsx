import * as React from "react";
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
  const { centerInfo, propsNotInInfo, centerId, currentUserId } = props;
  const { camelCaseToReadable } = formatter();

  const handleEditInfoClick = () => {
    router.push(`/profile/${userId}/edit`);
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
            mb: 4,
            justifyContent: "space-between",
            alignItems: "center",
            gap: 8,
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
          {/* Flex box containing profile info and center avatar */}
          <Box
            sx={{
              flexDirection: "column",
              display: "flex",
              alignItems: "center",
              position: "relative",
            }}
          >
            {/* Display users name */}
            <CardContent>
              <Typography
                variant="h4"
                align="center"
                sx={{
                  wordBreak: "break-word", // wrap should overflow occur
                  whiteSpace: "normal",
                }}
              >
                {centerInfo.name}
              </Typography>
            </CardContent>
            {/* Display centers avatar */}
            <Avatar
              sx={{
                bgcolor: "#a3b18a",
                width: 175,
                height: 175,
                border: "2px solid #000",
              }}
              alt="Center Avatar"
              src=""
            />
          </Box>
          <Box
            sx={{
              mt: 8,
            }}
          >
            <CardContent>
              {/* Info and conditional edit button */}
              {centerInfo && (
                <>
                  <Grid container spacing={2}>
                    {Object.entries(centerInfo).map(([key, value]) => {
                      if (!propsNotInInfo.includes(key)) {
                        return (
                          <Grid item xs={12} sm={6} key={key}>
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
