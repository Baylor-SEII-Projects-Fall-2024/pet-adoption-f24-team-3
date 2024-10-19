import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
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
import userService from "@/utils/services/userService";
import CenterCard from "@/components/CenterCard";

const quantityPerPage = 8;

export default function CentersPage() {
  const router = useRouter();
  const { getCentersByPage } = userService();

  const [centerData, setCenterData] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    async function load() {
      await getCentersByPage(quantityPerPage, 0)
        .then((result) => {
          if (result != null) {
            if (result.length < 1) {
              setHasMore(false);
            } else {
              setCenterData(result);
            }
          } else {
            console.error(
              "There was an error fetching more center data, returned",
              result
            );
          }
        })
        .catch((error) => {
          console.error(
            "There was an error fetching more center data: ",
            error
          );
        });
    }
    load();
  }, []);

  const fetchMoreData = async () => {
    await getCentersByPage(quantityPerPage, page)
      .then((result) => {
        if (result != null) {
          if (result.length < 1) {
            setHasMore(false);
          } else {
            console.log(result.map((a) => a.id));
            let dataCopy = centerData;
            let newData = [...new Set(dataCopy.concat(result))];
            setCenterData(newData);
            setPage((currentPage) => currentPage + 1);
          }
        } else {
          console.error(
            "There was an error fetching more center data, returned",
            result
          );
        }
      })
      .catch((error) => {
        console.error("There was an error fetching more center info", error);
      });
  };

  return (
    <>
      <Head>
        <title>View Adoption Centers</title>
      </Head>

      <main>
        <Stack sx={{ paddingTop: 4 }} alignItems="center" gap={2}>
          <Card sx={{ width: "80%", position: "relative" }} elevation={4}>
            <CardContent>
              <Typography variant="h3" align="center">
                Find centers
              </Typography>
              <Typography variant="body1" align="center" color="text.secondary">
                Adoption centers are constantly posting new pets and events!
                Click on a center to find out more.
              </Typography>
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
              dataLength={centerData.length}
              next={fetchMoreData}
              hasMore={hasMore}
              loader={<Loading doneLoading={!hasMore} page={page} />}
            >
              <Grid container spacing={4} sx={{ minHeight: "50px" }}>
                {centerData.map((center) => (
                  <Grid item xs={11} sm={5} md={3} key={center.id}>
                    <Box
                      onClick={() => router.push(`/centers/${center.id}`)}
                      sx={{ cursor: "pointer" }}
                    >
                      <CenterCard center={center} />
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
