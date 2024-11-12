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
} from "@mui/material";
import InfiniteScroll from "react-infinite-scroll-component";

import Loading from "@/components/Loading";
import eventService from "@/utils/services/eventService";
import userService from "@/utils/services/userService";
import EventCard from "@/components/EventCard";

const quantityPerPage = 12;

export default function EventsPage() {
  const router = useRouter();
  const { getEventsByPage } = eventService();
  const { getCenterInfo } = userService();
  const currentUserType = useSelector(
    (state) => state.currentUser.currentUserType
  );

  const [eventData, setEventData] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [filteredEvents, setFilteredEvents] = useState([]);
  const [stateFilter, setStateFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  

  useEffect(() => {
    async function load() {
      await getEventsByPage(quantityPerPage, 0)
        .then(async (result) => {
          if (result != null) {
            if (result.length < 1) {
              setHasMore(false);
            } else {
              const eventCenters = await fetchCenterData(result);
              setEventData(eventCenters);
              setFilteredEvents(eventCenters);
            }
          } else {
            console.error(
              "There was an error fetching more event data, returned",
              result
            );
          }
        })
        .catch((error) => {
          console.error("There was an error fetching more event data: ", error);
        });
    }
    load();
  }, []);

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
    if (eventData.length === 0) {
      setPage(0);
    }
    await getEventsByPage(quantityPerPage, page)
      .then(async (result) => {
        if (result != null) {
          if (result.length < 1) {
            setHasMore(false);
          } else {
            const newEventsWithCenters = await fetchCenterData(result);
            const newEventData = [...eventData, ...newEventsWithCenters];
            setEventData(newEventData);
            applyFilters(newEventData, stateFilter); 
            setPage((currentPage) => currentPage + 1);
          }
        } else {
          console.error(
            "There was an error fetching more event data, returned",
            result
          );
        }
      })
      .catch((error) => {
        console.error("There was an error fetching more event info", error);
      });
  };


  const applyFilters = (events) => {
    if (!stateFilter && !cityFilter) {
      setFilteredEvents(events);
      return;
    }
  
    const filtered = events.filter((event) => {
      const matchesState =
        stateFilter.length > 1
          ? event.center?.state.toLowerCase() === stateFilter.toLowerCase()
          : true;
  
      const matchesCity =
        cityFilter.length > 1
          ? event.center?.city.toLowerCase() === cityFilter.toLowerCase()
          : true;
  
      return matchesState && matchesCity;
    });
  
    setFilteredEvents(filtered);
  };

  const handleStateFilterChange = (e) => {
    const filter = e.target.value;
    setStateFilter(filter);
    applyFilters(eventData);
  };

  const handleCityFilterChange = (e) => {
    const filter = e.target.value;
    setCityFilter(filter);
    applyFilters(eventData);
  };

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
              <TextField
                label="Filter by State"
                variant="outlined"
                fullWidth
                margin="normal"
                value={stateFilter}
                onChange={handleStateFilterChange}
              />
              <TextField
                label="Filter by City"
                variant="outlined"
                fullWidth
                margin="normal"
                value={cityFilter}
                onChange={handleCityFilterChange}
              />
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
              dataLength={filteredEvents.length}
              next={fetchMoreData}
              hasMore={hasMore}
              loader={<Loading doneLoading={!hasMore} page={page} />}
            >
              <Grid container spacing={4} sx={{ minHeight: "50px" }}>
                {filteredEvents.map((event) => (
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
