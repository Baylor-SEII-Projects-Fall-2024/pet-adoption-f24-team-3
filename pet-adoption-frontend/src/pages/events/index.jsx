import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import {
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
  Grid,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";
import InfiniteScroll from "react-infinite-scroll-component";

import Loading from "@/components/Loading";
import eventService from "@/utils/services/eventService";
import userService from "@/utils/services/userService";
import EventCard from "@/components/EventCard";
import stateNames from "@/utils/lists";

const quantityPerPage = 12;

export default function EventsPage() {
  const router = useRouter();
  const { getEventsByPageSort } = eventService();
  const { getCenterInfo } = userService();
  const currentUserType = useSelector(
    (state) => state.currentUser.currentUserType
  );

  const [eventData, setEventData] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [stateSort, setStateSort] = useState("");
  const [citySort, setCitySort] = useState("");

  useEffect(() => {
    async function load() {
      setPage(1); // Reset page to 1
      setHasMore(true); // Reset infinite scroll state

      const result = await getEventsByPageSort(quantityPerPage, 0, stateSort, citySort);
      if (result && result.length > 0) {
        const eventCenters = await fetchCenterData(result);
        setEventData(eventCenters);
      } else {
        setEventData([]); // No events found
        setHasMore(false); // No more data to load
      }
    }
    load();
}, [stateSort, citySort]); // Fetch when either of these values change


  const fetchCenterData = async (events) => {
    const eventCenters = await Promise.all(
      events.map(async (event) => {
        const center = await getCenterInfo(event.centerId);
        return { ...event, center };
      })
    );
    return eventCenters;
  };

  const fetchMoreData = async () => {
    if (!hasMore) return; // If no more data, don't fetch
  
    // Increment page number only for the next fetch
    const nextPage = page;
    setPage(nextPage + 1); // Increment page number
  
    const result = await getEventsByPageSort(quantityPerPage, nextPage, stateSort, citySort);
    if (result && result.length > 0) {
      const eventCenters = await fetchCenterData(result);
      setEventData((prevData) => [...prevData, ...eventCenters]); // Append new events to existing data
    } else {
      setHasMore(false); // No more data
    }
  };
  

  const handleSortChangeState = (e) => {
    const value = e.target.value;
    setStateSort(value); // Update state sort
    setPage(1); // Reset page to 1 when filters change
  };
  
  const handleSortChangeCity = (e) => {
    const value = e.target.value;
    setCitySort(value); // Update city sort
    setPage(1); // Reset page to 1 when filters change
  };
  
  // const loadData = async (newStateSort, newCitySort) => {
  //   try {
  //     const result = await getEventsByPageSort(quantityPerPage, 0, newStateSort, newCitySort); // Get events from API
  //     if (result && result.length > 0) {
  //       const eventCenters = await fetchCenterData(result); // Fetch center data
  //       setEventData(eventCenters); // Set the fetched data
  //     } else {
  //       setEventData([]); // Reset if no events are found
  //       setHasMore(false); // Disable infinite scroll
  //     }
  //   } catch (error) {
  //     console.error("Error fetching events:", error);
  //   }
  // };
  
  

  return (
    <>
      <Head>
        <title>View Events</title>
      </Head>

      <main>
        <Stack sx={{ paddingTop: 4 }} alignItems="center" gap={2}>
          <Card sx={{ width: "80%", position: "relative" }} elevation={4}>
            <CardContent>
              <Typography variant="h3" align="center">
                Find events
              </Typography>
              <Typography variant="body1" align="center" color="text.secondary">
                Centers near you are hosting events for you to find your new
                best friend! Click on event to find out more.
              </Typography>
              {currentUserType == "Center" && (
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => router.push(`/events/create`)}
                  sx={{
                    width: 200,
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                  }}
                >
                  Post New Event
                </Button>
              )}
              <Box 
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 2,
                  flexWrap: "wrap",
                  marginTop: "20px"
                }}
                >
              <FormControl sx={{ minWidth: "100px", height: "40px" }}>
                        <InputLabel id="state-select-label">State</InputLabel>
                        <Select
                            labelId="state-select-label"
                            id="state-select"
                            value={stateSort}
                            size="small"
                            onChange={handleSortChangeState}
                            sx={{ width: "10em" }}
                        >
                            <MenuItem value={""}>Please Select</MenuItem>
                            {stateNames.map((state, index) => (
                                <MenuItem key={index} value={state}>{state}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
              <TextField
                label="Filter by City"
                variant="outlined"
                value={citySort}
                onChange={handleSortChangeCity}
                sx={{ minWidth: "100px", 
                  height: "40px", 
                  "& .MuiInputBase-root": {
                    height: "40px", // Control the input box height
                  }, 
                }}
              />
              </Box>
            </CardContent>
          </Card>
          <Box
            sx={{
              width: "90%",
              minHeight: "300px",
              marginTop: "30px",
            }}
          >
            <InfiniteScroll
              dataLength={eventData.length}
              next={fetchMoreData}
              hasMore={hasMore}
              loader={<Loading doneLoading={!hasMore} page={page} />}
            >
              <Grid container spacing={4} sx={{ minHeight: "50px" }}>
                {eventData.map((event) => (
                  <Grid item xs={11} sm={5} md={3} key={event.id}>
                    <Box
                      onClick={() => router.push(`/events/${event.id}`)}
                      sx={{ cursor: "pointer" }}
                    >
                      <EventCard event={event} />
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </InfiniteScroll>
          </Box>
        </Stack>
      </main>
    </>
  );
}
