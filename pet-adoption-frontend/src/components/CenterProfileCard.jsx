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

  return (
    <>
      {/* Create flex box to contain Avatar and User Info cards */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        {/* Create card to display users name and avatar */}
        <Card
          sx={{
            minWidth: 275,

            mb: 3,
            mt: 3,
            mr: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 0,
            paddingBottom: 4,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <Box
              sx={{
                flexDirection: "column",
                display: "flex",
                alignItems: "center",
                mr: 20,
              }}
            >
              {/* Display users name */}
              <CardContent>
                <Typography
                  variant="h3"
                  component="div"
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
            {/* Create card to display center Info */}
            <Box sx={{ mb: 3, mt: 3, ml: 30 }}>
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

          <Typography variant="h4" alignSelf="left">
            I am an example description
          </Typography>

          {/* Display edit button if user is viewing their own page */}
          {String(centerId) === String(currentUserId) && (
            <Grid item xs={12}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  mt: 2,
                }}
              >
                <Button
                  variant="contained"
                  color="secondary"
                  sx={{
                    padding: "12px 12px",
                    fontSize: "16px",
                    minWidth: "200px",
                  }}
                  onClick={handleEditInfoClick}
                >
                  Edit Info
                </Button>
              </Box>
            </Grid>
          )}
        </Card>
      </Box>
    </>
  );
}
