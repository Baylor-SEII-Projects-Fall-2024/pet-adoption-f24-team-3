import * as React from "react";
import { useRouter } from "next/router";
import {
  Card,
  Box,
  CardContent,
  Typography,
  Button,
  Avatar,
} from "@mui/material";
import ContactCard from "@/components/ContactCard"; /* testing this out */
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function CenterProfileCard(props) {
  const router = useRouter();
  const { centerInfo, centerId, currentUserId } = props;

  const handleEditInfoClick = () => {
    router.push(`/centers/${centerId}/edit`);
  };

  const handleChangePasswordClick = () => {
    router.push(`/centers/${centerId}/change-password`);
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
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Typography variant="h4">{centerInfo.name}</Typography>
          {/* Display edit button if user is viewing their own page */}
          {String(centerId) === String(currentUserId) ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                flexDirection: "column",
                mt: 2
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
              <Button
                variant="contained"
                color="secondary"
                sx={{
                  padding: "12px 12px",
                  fontSize: "16px",
                  minWidth: "200px",
                }}
                onClick={handleChangePasswordClick}
              >
                Change Password
              </Button>
            </Box>
          ) : (
            <ContactCard contactee={centerId} sender={currentUserId} />
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
              src={`${apiUrl}/api/images/users/${centerId}/profile`}
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
                  <Typography variant="h5">About</Typography>
                  <Typography variant="body1" align="left">
                    {centerInfo.description}
                  </Typography>
                  <br />
                  <Typography variant="h5">Contact Information</Typography>
                  <Typography variant="body1">
                    Email: {centerInfo.emailAddress}{" "}
                  </Typography>
                  <Typography variant="body1">
                    Address: {centerInfo.address}, {centerInfo.city},{" "}
                    {centerInfo.state}, {centerInfo.zipCode}{" "}
                  </Typography>
                </>
              )}
            </CardContent>
          </Box>
        </Box>

        <Box
          sx={{
            width: "100%",
          }}
        ></Box>
      </Card>
    </Box>
  );
}
