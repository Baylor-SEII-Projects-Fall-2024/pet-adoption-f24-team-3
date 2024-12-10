import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import Head from "next/head";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Card,
  CardContent,
  AppBar,
  Grid,
  Button,
} from "@mui/material";

import CenterProfileCard from "@/components/CenterProfileCard";
import EventCard from "@/components/EventCard";
import PetCard from "@/components/PetCard";
import TabPanel from "@/components/TabPanel";

import userService from "@/utils/services/userService";
import animalService from "@/utils/services/animalService";
import eventService from "@/utils/services/eventService";
import guiltService from "@/utils/services/guiltService";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// Renders the pets and events tabs
function PetsAndEventsTabs(props) {
  const currentUserId = useSelector((state) => state.currentUser.currentUserId);
  const { pets, adoptedAnimals, events, router, isLoggedInCenter } = props;
  const [value, setValue] = useState("one");
  const {
    getDislikeCount,
    incrementDislikeCount,
    decrementDislikeCount,
    getEuthanizedPetIds,
    updateEuthanizedPetIds,
  } = guiltService();

  // State for owner-specific data
  const { getUserInfo, getOwnerInfo } = userService();

  // Grief shi
  const [euthanizedPetIds, setEuthanizedPetIds] = React.useState(new Set());
  const [audio, setAudio] = React.useState(null);
  const grief = useSelector((state) => state.griefEngine.griefEngineEnabled);

  const playAudio = () => {
    if (audio) {
      console.log("Playing audio");
      audio.play();
    } else {
      console.log("No audio");
    }
  };

  useEffect(() => {
    if (!currentUserId) return;

    if (grief) {
      async function grabAudio() {
        if (typeof window !== 'undefined') {
          setAudio(new Audio('/sounds/angel.mp3'));
        }
      }
      grabAudio();

      const fetchData = async () => {
        try {
          const userInfo = await getUserInfo(currentUserId);

          if (userInfo.accountType === "Owner") {
            // Fetch owner-specific grief data
            try {
              const euthanizedPetIdsResult = await getEuthanizedPetIds(currentUserId);
              /**
               * We have to do this because otherwise the set will contain
               * a single element for each character. i.e.
               * Set: [ '[', '1', '2', '3', ',', '4', 5', '6', ']' ]
               * Instead of actually storing a set of pet ids
               * */
              const parsedEuthanizedIds = JSON.parse(euthanizedPetIdsResult);
              setEuthanizedPetIds(new Set(parsedEuthanizedIds));
            } catch (error) {
              console.error("Error fetching grief data:", error);
            }
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      fetchData();
    } else {
      setEuthanizedPetIds(new Set());
    }
  }, [currentUserId, grief]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleEventClick = (eventId) => {
    router.push(`/events/${eventId}`);
  };

  const handlePetClick = (petId) => {
    router.push(`/pets/${petId}`);
  };

  const updateTotalDislikes = async (petId, decrement = false) => {
    try {
      if (!grief) return;
      let updateSuccess;
      if (decrement) {
        // Decrement dislike count if needed
        updateSuccess = await decrementDislikeCount(currentUserId);
      } else {
        // Increment dislike count
        updateSuccess = await incrementDislikeCount(currentUserId);
      }

      if (updateSuccess) {
        // Fetch updated total dislikes
        const updatedTotalDislikes = await getDislikeCount(currentUserId);

        if (updatedTotalDislikes > 0 && updatedTotalDislikes % 5 === 0 && !decrement) {
          await updateEuthanizedPetIds(currentUserId, petId);
          const updatedEuthanizedIds = await getEuthanizedPetIds(currentUserId);

          const parsedEuthanizedIds = JSON.parse(updatedEuthanizedIds);

          setEuthanizedPetIds(new Set(parsedEuthanizedIds));
          playAudio();
        }
      }
    } catch (error) {
      console.error("Error updating dislikes:", error);
    }
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
        <Tab value="one" label="Availible Pets" />
        <Tab value="two" label="Upcoming Events" />
        {isLoggedInCenter && <Tab value="three" label="Adopted Pets" />}
      </Tabs>
      <TabPanel value={value} index="one">
        {isLoggedInCenter && (
          <Button
            variant="contained"
            color="secondary"
            onClick={() => router.push(`/pets/new`)}
            sx={{ width: 200, mb: "30px" }}
          >
            Post New Pet
          </Button>
        )}
        <Grid container spacing={5}>
          {pets.map((pet) => (
            <Grid item xs={11} sm={5} md={3} key={pet.id}>
              <Box
                onClick={() => handlePetClick(pet.id)}
                sx={{ cursor: "pointer" }}
              >
                <PetCard
                  pet={pet}
                  updateTotalDislikes={(petId, decrement) => updateTotalDislikes(pet.id, decrement)}
                  euthanizedPetIds={euthanizedPetIds}
                />
              </Box>
            </Grid>
          ))}
        </Grid>
      </TabPanel>
      <TabPanel value={value} index="two">
        {isLoggedInCenter && (
          <Button
            variant="contained"
            color="secondary"
            onClick={() => router.push(`/events/create`)}
            sx={{ width: 200, mb: "30px" }}
          >
            Post New Event
          </Button>
        )}
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
      {isLoggedInCenter && (
        <TabPanel value={value} index="three">
          <Grid container spacing={5}>
            {adoptedAnimals.map((animal) => (
              <Grid item xs={11} sm={5} md={3} key={animal.id}>
                <Box
                  onClick={() => handlePetClick(animal.id)}
                  sx={{ cursor: "pointer" }}
                >
                  <PetCard
                    pet={animal}
                    updateTotalDislikes={() => updateTotalDislikes(animal.id)}
                    euthanizedPetIds={euthanizedPetIds}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
        </TabPanel>
      )}
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
  const { getCenterAdoptedAnimals } = animalService();
  const { getCenterEvents } = eventService();
  const [centerInfo, setCenterInfo] = useState(null);
  const [pets, setPets] = useState(null);
  const [adoptedAnimals, setAdoptedAnimals] = useState(null);
  const [events, setEvents] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (centerId) {
      const fetchCenterInfo = async () => {
        try {
          const centerResult = await getCenterInfo(centerId);
          const animalsResult = await getCenterAnimals(centerId);
          const adoptedAnimalsResult = await getCenterAdoptedAnimals(centerId);
          const eventsResult = await getCenterEvents(centerId);
          if (centerResult !== null) {
            setCenterInfo(centerResult);
          }
          if (animalsResult !== null) {
            setPets(animalsResult);
          }
          if (adoptedAnimalsResult !== null) {
            setAdoptedAnimals(adoptedAnimalsResult);
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
    <>
      <Head>
        <title>{centerInfo.name}</title>
      </Head>
      <main>
        <Box sx={{ width: "100%", padding: 0 }}>
          <AppBar
            position="static"
            sx={{
              width: "100%",
              padding: 0,
            }}
          >
            <img
              src={`${apiUrl}/api/images/users/${centerId}/banner`}
              alt="Center Banner"
              style={{ width: "100%", maxHeight: 225, objectFit: "cover" }}
            />
          </AppBar>
          <CenterProfileCard
            centerInfo={centerInfo}
            centerId={centerId}
            currentUserId={currentUserId}
          />
          <PetsAndEventsTabs
            pets={pets}
            adoptedAnimals={adoptedAnimals}
            events={events}
            router={router}
            isLoggedInCenter={currentUserId == centerId}
          />
        </Box>
      </main>
    </>
  );
}
