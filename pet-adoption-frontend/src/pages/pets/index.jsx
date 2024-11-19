import React from "react";
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
import animalService from "@/utils/services/animalService";
import PetCard from "@/components/PetCard";

const quantityPerPage = 12;

export default function PetsPage() {
  const router = useRouter();
  const { getRecommendedAnimals } = animalService();
  const currentUserId = useSelector((state) => state.currentUser.currentUserId); // get the current session user
  const currentUserType = useSelector((state) => state.currentUser.currentUserType);

  const [animalData, setAnimalData] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [hasMore, setHasMore] = React.useState(true);

  //get initial data. Have to do this separately, because infite scroll will only
  //load when you scroll to the bottom. This is why `page` starts at 1, if it started
  //at 0, there would be a chance that the first round of data would be fetched 2x
  React.useEffect(() => {
    async function load() {
      if (!currentUserId) return;

      await getRecommendedAnimals(currentUserId, quantityPerPage, [])
        .then((result) => {
          if (result != null) {
            if (result.length < 1) {
              setHasMore(false);
            } else {
              setAnimalData(result);
            }
          } else {
            console.error(
              "There was an error fetching more animal data, returned",
              result
            );
          }
        })
        .catch((error) => {
          console.error("There was an error fetching more animal data:", error);
        });
    }
    load();
  }, [currentUserId]);

  //get data after first call, called by infinite scroll
  const fetchMoreData = async () => {
    if (animalData.length === 0) {
      return;
    }
    let previousIds = animalData.map(a => a.id);
    await getRecommendedAnimals(currentUserId, quantityPerPage, previousIds)
      .then((result) => {
        if (result != null) {
          if (result.length < 1) {
            setHasMore(false);
          } else {
            //converting copy of data to a set, then setting that,
            //to make sure no duplicates are rendered
            let dataCopy = animalData;
            let newData = [...new Set(dataCopy.concat(result))];
            setAnimalData(newData);
            setPage((currentPage) => currentPage + 1);
          }
        } else {
          console.error(
            "There was an error fetching more animal data, returned",
            result
          );
        }
      })
      .catch((error) => {
        console.error("There was an error fetching more animal data:", error);
      });
  };

  return (
    <>
      <Head>
        <title>View Pets</title>
      </Head>

      <main>
        <Stack sx={{ paddingTop: 4 }} alignItems="center" gap={2}>
          <Card sx={{ width: "80%", position: "relative" }} elevation={4}>
            <CardContent>
              <Typography variant="h3" align="center">
                Find your pet
              </Typography>
              <Typography variant="body1" align="center" color="text.secondary">
                Like or dislike a pet based on your preferences, WOOF will learn
                as you go and show you more pets you may be interesed in!
              </Typography>
              {currentUserType == "Center" ? (
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => router.push(`/pets/new`)}
                  sx={{
                    width: 200,
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                  }}
                >
                  Post New Pet
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => router.push(`/pets/liked`)}
                  sx={{
                    width: 200,
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                  }}
                >
                  Liked Pets
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
              dataLength={animalData.length}
              next={fetchMoreData}
              hasMore={hasMore}
              loader={<Loading doneLoading={!hasMore} page={page} />}
            >
              <Grid container spacing={4} sx={{ minHeight: "50px" }}>
                {animalData.map((pet) => (
                  <Grid item xs={11} sm={5} md={3} key={pet.id}>
                    <Box
                      onClick={() => router.push(`/pets/${pet.id}`)}
                      sx={{ cursor: "pointer" }}
                    >
                      <PetCard pet={pet} />
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
