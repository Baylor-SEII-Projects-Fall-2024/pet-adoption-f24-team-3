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
} from "@mui/material";
import InfiniteScroll from "react-infinite-scroll-component";

import Loading from "@/components/Loading";
import eventService from "@/utils/services/eventService";
import EventCard from "@/components/EventCard";

const quantityPerPage = 8;

export default function EventsPage() {
  const router = useRouter();
  const { getEventsByPage } = eventService();
  const currentUserType = useSelector(
    (state) => state.currentUser.currentUserType
  );

  const [eventData, setEventData] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    async function load() {
      await getEventsByPage(quantityPerPage, 0)
        .then((result) => {
          if (result != null) {
            if (result.length < 1) {
              setHasMore(false);
            } else {
              setEventData(result);
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

  const fetchMoreData = async () => {
    await getEventsByPage(quantityPerPage, page)
      .then((result) => {
        if (result != null) {
          if (result.length < 1) {
            setHasMore(false);
          } else {
            console.log(result.map((a) => a.id));
            let dataCopy = eventData;
            let newData = [...new Set(dataCopy.concat(result))];
            setEventData(newData);
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
              loader={<Loading doneLoading={!hasMore} />}
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
