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
  Grid,
} from "@mui/material";
import userService from "@/utils/services/userService";
import animalService from "@/utils/services/animalService";
import eventService from "@/utils/services/eventService";
import CenterProfileCard from "@/components/CenterProfileCard";
import EventCard from "@/components/EventCard";
import PetCard from "@/components/PetCard";
import TabPanel from "@/components/TabPanel";

// Renders the pets and events tabs
function PetsAndEventsTabs(props) {
  const { pets, events, router } = props;
  const [value, setValue] = useState("one");
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleEventClick = (eventId) => {
    router.push(`/events/${eventId}`);
  };

  const handlePetClick = (petId) => {
    router.push(`/pets/${petId}`);
  };
  return (
    <Box
      sx={{
        margin: 3,
      }}
    >
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
        <Grid container spacing={5}>
          {events.map((event) => (
            <Grid item xs={11} sm={5} md={3} key={event.id}>
              <Box
                onClick={() => handleEventClick(event.id)}
                sx={{ cursor: "pointer" }}
              >
                <EventCard event={event} />
              </Box>
            </Grid>
          ))}
        </Grid>
      </TabPanel>
      <TabPanel value={value} index="two">
        <Grid container spacing={5}>
          {pets.map((pet) => (
            <Grid item xs={11} sm={5} md={3} key={pet.id}>
              <Box
                onClick={() => handlePetClick(pet.id)}
                sx={{ cursor: "pointer" }}
              >
                <PetCard pet={pet} />
              </Box>
            </Grid>
          ))}
        </Grid>
      </TabPanel>
    </Box>
  );
}

export default function CenterPage() {
  const router = useRouter();
  const { centerId } = router.query; //get user ID from the routing
  const currentUserId = useSelector((state) =>
    state.currentUser.currentUserId !== null
      ? state.currentUser.currentUserId
      : null
  ); // get the current session user
  const { getCenterInfo } = userService();
  const { getCenterAnimals } = animalService();
  const { getCenterEvents } = eventService();
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

  if ((loading || !centerInfo) && !error) {
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
          src={`http://localhost:8080/api/images/users/${centerId}/banner`}
          alt="Center Banner"
          style={{ width: "100%", maxHeight: 225, objectFit: "cover" }}
        />
      </AppBar>
      <CenterProfileCard
        centerInfo={centerInfo}
        centerId={centerId}
        currentUserId={currentUserId}
      />
      <PetsAndEventsTabs pets={pets} events={events} router={router} />
    </Box>
  );
}