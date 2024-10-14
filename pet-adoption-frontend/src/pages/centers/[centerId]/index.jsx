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
} from "@mui/material";
import userService from "@/utils/services/userService";
import CenterProfileCard from "@/components/CenterProfileCard";
import TabEventCard from "@/components/TabEventCard";
import TabPetCard from "@/components/TabPetCard";
import TabPanel from "@/components/TabPanel";

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
          <TabEventCard event={event} key={event.id} />
        ))}
      </TabPanel>
      <TabPanel value={value} index="two">
        {/* Content for Pets */}
        {pets.map((pet) => (
          <TabPetCard pet={pet} key={pet.id} />
        ))}
      </TabPanel>
    </>
  );
}

export default function ProfilePage() {
  const propsNotInInfo = [
    "bannerPicPath",
    "profilePicPath",
    "name",
    "password",
    "id",
    "description",
  ];
  const router = useRouter();
  const { centerId } = router.query; //get user ID from the routing
  const currentUserId = useSelector((state) =>
    state.currentUser.currentUserId !== null
      ? state.currentUser.currentUserId
      : null
  ); // get the current session user
  const { getCenterInfo, getCenterAnimals, getCenterEvents } = userService();
  const [centerInfo, setCenterInfo] = useState(null);
  const [pets, setPets] = useState(null);
  const [events, setEvents] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleEditInfoClick = () => {
    router.push(`/profile/${userId}/edit`);
  };

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
    <Box sx={{ width: "100%", padding: 0, minWidth: 275 }}>
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
      <CenterProfileCard
        centerInfo={centerInfo}
        propsNotInInfo={propsNotInInfo}
        centerId={centerId}
        currentUserId={currentUserId}
      />

      <PetsAndEventsTabs pets={pets} events={events}></PetsAndEventsTabs>
    </Box>
  );
}
