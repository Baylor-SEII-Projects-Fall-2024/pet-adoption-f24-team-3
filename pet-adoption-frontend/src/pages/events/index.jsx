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
import infoLists from "@/utils/lists";

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
  const [stateFilter, setStateFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [filter, setFilter] = useState(false);

  const stateNames = infoLists().stateNames

  useEffect(() => {
    async function load() {
      setPage(0); 
      setHasMore(true);

      const result = await getEventsByPageSort(quantityPerPage, 0, stateFilter, cityFilter);
      if (result && result.length > 0) {
        setEventData(result);
      } else {
        setEventData([]); 
        setHasMore(false);
      }
    }
    load();
}, [filter]); 


  const fetchMoreData = async () => {
    if (!hasMore) return; 
  
    const nextPage = page;
    setPage(nextPage + 1);
  
    const result = await getEventsByPageSort(quantityPerPage, nextPage, stateFilter, cityFilter);
    if (result && result.length > 0) {
      setEventData((prevData) => [...prevData, ...result]);
    } else {
      setHasMore(false); 
    }
  };
  

  const handleSortChangeState = (e) => {
    const value = e.target.value;
    setStateFilter(value); 
    setPage(0);
  };
  
  const handleSortChangeCity = (e) => {
    const value = e.target.value;
    setCityFilter(value);
    setPage(0);
  };
  
  const handleFilterChange = (e) => {
    setEventData([]);
    fetchMoreData();
    if(filter == false){
      setFilter(true);
    }else{
      setFilter(false);
    }
    
  }

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
                            value={stateFilter}
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
                value={cityFilter}
                onChange={handleSortChangeCity}
                sx={{ minWidth: "100px", 
                  height: "40px", 
                  "& .MuiInputBase-root": {
                    height: "40px", // Control the input box height
                  }, 
                }}
              />
              <Button 
                onClick={handleFilterChange}
                variant="contained"
                color="secondary">
                  Search
              </Button>
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
