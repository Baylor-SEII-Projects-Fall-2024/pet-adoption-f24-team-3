/**
 * File: pets/index.jsx
 * Author: Icko Iben
 * Date Created: 09/24/2024
 * Date Last Modified: 09/24/2024
 * */

import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Button, Card, CardContent, Stack, Typography, Grid, Box } from '@mui/material';
import InfiniteScroll from "react-infinite-scroll-component";

import Loading from '@/components/Loading';
import animalService from '@/utils/services/animalService';
import PetCard from '@/components/PetCard';

const quantityPerPage = 4;

export default function PetsPage() {
  const router = useRouter();
  const { getRecommendedAnimals } = animalService();

  const [animalData, setAnimalData] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [hasMore, setHasMore] = React.useState(true);

  const fetchMoreData = async () => {
    console.log("Fetching more!", page);
    await getRecommendedAnimals(quantityPerPage, page)
      .then((result) => {
        if (result != null) {
          if (result.length < 1) {
            console.log("Out of data!");
            setHasMore(false);
          } else {
            //converting copy of data to a set, then setting that,
            //to make sure no duplicates are rendered 
            let dataCopy = animalData;
            let newData = [...new Set(dataCopy.concat(result))];
            setAnimalData(newData);
            setPage(currentPage => currentPage + 1);
            console.log(`Added ${newData.length - dataCopy.length} items!`);
          }
        }
        else {
          console.error("There was an error fetching more animal data, returned", result);
        }
      })
      .catch((error) => {
        console.error("There was an error fetching more animal data:", error);
      });
  }

  return (
    <>
      <Head>
        <title>View Pets</title>
      </Head>

      <main>
        <Stack sx={{ paddingTop: 4 }} alignItems='center' gap={2}>
          <Card sx={{ width: "80%" }} elevation={4}>
            <CardContent>
              <Typography variant='h3' align='center'>Fund your pet</Typography>
              <Typography variant='body1' align='center' color='text.secondary'>Like or dislike a pet based on your preferences, WOOF will learn as you go and show you more pets you may be interesed in!</Typography>

            </CardContent>
          </Card>
          <Stack direction="column">
            <Button variant='contained' onClick={() => router.push(`/pets/new`)} sx={{ width: 200 }}>New Pet</Button>
            <Button variant='contained' onClick={() => console.log(animalData)} sx={{ width: 200 }}>See data</Button>
          </Stack>

          <Box
            sx={{
              width: "90%",
              minHeight: "500px",
            }}>
            <InfiniteScroll
              dataLength={animalData.length}
              next={fetchMoreData}
              hasMore={hasMore}
              loader={<Loading doneLoading={!hasMore} />}
            >
              <Grid container spacing={4} sx={{ minHeight: "50px" }}>
                {animalData.map((pet) => (
                  <Grid item xs={11} sm={5} md={3} key={pet.id} >
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
      </main >
    </>
  );
}
