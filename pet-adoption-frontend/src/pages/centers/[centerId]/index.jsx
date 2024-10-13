import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Card,
  CardContent,
  AppBar,
  Avatar,
  Stack,
} from "@mui/material";
import userService from "@/utils/services/userService";
import { format } from "date-fns";

// Used to parse JSON so words are pretty
function camelCaseToReadable(text) {
  return text
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());
}

// Custom TabPanel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

// Renders the pets and events tabs
function PetsAndEventsTabs(props) {
  const { pets, events } = props;
  const [value, setValue] = useState("one");
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <>
      <Tabs
        value={value}
        onChange={handleChange}
        textColor="secondary"
        indicatorColor="secondary"
        aria-label="pets and events tabs"
      >
        <Tab value="one" label="Events" />
        <Tab value="two" label="Pets" />
      </Tabs>
      <TabPanel value={value} index="one">
        {/* Content for events */}
        {events.map((event) => (
          <Card key={event.id} sx={{ marginBottom: 2 }}>
            <CardContent>
              <Typography variant="h5">{event.name}</Typography>
              <Typography variant="body1" color="textSecondary">
                {event.description}
              </Typography>
              {Object.entries(event).map(([key, value]) => {
                if (
                  key !== "name" &&
                  key !== "description" &&
                  key !== "datePosted"
                ) {
                  return (
                    <Typography key={key} variant="body2" color="textSecondary">
                      {`${camelCaseToReadable(key)}: ${
                        ["datePosted", "dateStart", "dateEnd"].includes(key)
                          ? format(new Date(value), "MMMM dd, yyyy")
                          : value === null
                          ? "N/A"
                          : value
                      }`}
                    </Typography>
                  );
                }
              })}
            </CardContent>
          </Card>
        ))}
      </TabPanel>
      <TabPanel value={value} index="two">
        {/* Content for Pets */}
        {pets.map((pet) => (
          <Card key={pet.id} sx={{ marginBottom: 2 }}>
            <CardContent>
              <Typography variant="h5">{pet.name}</Typography>
              <Typography variant="body2" color="textSecondary">
                {pet.description}
              </Typography>
              {Object.entries(pet).map(([key, value]) => {
                if (key !== "name" && key !== "description") {
                  return (
                    <Typography key={key} variant="body2" color="textSecondary">
                      {`${camelCaseToReadable(key)}: ${
                        key === "datePosted"
                          ? format(new Date(value), "MMMM dd, yyyy")
                          : value === null
                          ? "N/A"
                          : value
                      }`}
                    </Typography>
                  );
                }
                return null;
              })}
            </CardContent>
          </Card>
        ))}
      </TabPanel>
    </>
  );
}

export default function ProfilePage() {
  const NUM_PROPS_NOT_DISPLAYED = 4;
  const router = useRouter();
  const { centerId } = router.query; //get user ID from the routing
  const currentUserId = useSelector((state) =>
    state.currentUser.currentUserId !== null
      ? state.currentUser.currentUser
      : null
  ); // get the current session user
  const { getCenterInfo, getCenterAnimals, getCenterEvents } = userService();
  const [centerInfo, setCenterInfo] = useState(null);
  const [pets, setPets] = useState(null);
  const [events, setEvents] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (centerId) {
      const fetchCenterInfo = async () => {
        try {
          const centerResult = await getCenterInfo(centerId);
          const animalsResult = await getCenterAnimals(centerId);
          const eventsResult = await getCenterEvents(centerId);
          if (centerResult !== null) {
            setCenterInfo(centerResult);
          }
          if (animalsResult !== null) {
            setPets(animalsResult);
          }
          if (eventsResult !== null) {
            setEvents(eventsResult);
          }
        } catch (error) {
          console.log(error);
          setError(`Error getting information for center id ${centerId}`);
        } finally {
          setLoading(false);
        }
      };

      fetchCenterInfo();
    }
  }, [centerId]);

  if (loading) {
    return (
      // Create flex box to contain all components
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {/* Create loading card */}
        <Card sx={{ minWidth: 275, mb: 2 }}>
          <CardContent>
            <Typography variant="h5" component="div">
              Loading...
            </Typography>
          </CardContent>
        </Card>
      </Box>
    );
  }

  if (error) {
    return (
      // Create flex box to contain all components
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {/* Create error card */}
        <Card sx={{ minWidth: 275, mb: 2 }}>
          <CardContent>
            <Typography variant="h5" component="div" color="error">
              {error}
            </Typography>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", padding: 0 }}>
      <AppBar
        position="static"
        sx={{
          width: "100%",
          padding: 0,
        }}
      >
        <img
          src="/defaults/tracy1.jpg"
          alt="Center Banner"
          style={{ width: "100%", maxHeight: 225, objectFit: "cover" }}
        />
      </AppBar>
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
            padding: 2,
            paddingBottom: 4,
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
          {/* Create card to display center Info */}
        </Card>
        <Card sx={{ mb: 3, mt: 3 }}>
          <CardContent>
            {/* Title */}
            <Typography mb={2} variant="h5">
              Center Info
            </Typography>
            {/* Info and conditional edit button */}
            {centerInfo && (
              <Stack
                spacing={
                  Object.keys(centerInfo).length - NUM_PROPS_NOT_DISPLAYED
                }
              >
                {Object.entries(centerInfo).map(([key, value]) => {
                  if (
                    key !== "bannerPicPath" &&
                    key !== "profilePicPath" &&
                    key !== "name" &&
                    key !== "password" &&
                    key !== "id"
                  ) {
                    return (
                      <Typography
                        key={key}
                        variant="body2"
                        color="textSecondary"
                      >
                        {`${camelCaseToReadable(key)}: ${
                          value === null ? "N/A" : value
                        }`}
                      </Typography>
                    );
                  }
                })}
                {/* Display edit button if user is viewing their own page */}
                {String(centerId) === String(currentUserId) && (
                  <Box
                    sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}
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
                )}
              </Stack>
            )}
          </CardContent>
        </Card>
      </Box>
      <PetsAndEventsTabs pets={pets} events={events}></PetsAndEventsTabs>
    </Box>
  );
}
