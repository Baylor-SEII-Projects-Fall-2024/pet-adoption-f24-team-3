import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Box, Tabs, Tab, Typography, Card, CardContent } from "@mui/material";
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

export default function ProfilePage() {
  const router = useRouter();
  const { centerId } = router.query; //get user ID from the routing
  const { getCenterAnimals, getCenterEvents } = userService();
  const [pets, setPets] = useState(null);
  const [events, setEvents] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [value, setValue] = useState("one");

  useEffect(() => {
    if (centerId) {
      const fetchCenterInfo = async () => {
        try {
          const animalsResult = await getCenterAnimals(centerId);
          const eventsResult = await getCenterEvents(centerId);
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

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  if (loading)
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

  if (error)
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

  return (
    <Box sx={{ width: "100%" }}>
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
    </Box>
  );
}
