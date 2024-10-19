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
  const currentUserType = useSelector(
    (state) => state.currentUser.currentUserType
  );

  const [eventData, setEventData] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    async function load() {}
  }, []);

  return (
    <div>
      <h1>This is where events can be found!</h1>
      <TextField label="EventID" id="searchTxt" variant="filled" size="small" />
      <Button
        variant="contained"
        onClick={() =>
          router.push(`/events/${document.getElementById("searchTxt").value}`)
        }
        sx={{ width: 200 }}
      >
        Find an event!
      </Button>
      <Button
        variant="contained"
        onClick={() => router.push(`/events/create`)}
        sx={{ width: 200 }}
      >
        Create a New Event!
      </Button>
    </div>
  );
}
