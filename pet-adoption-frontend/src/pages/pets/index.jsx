import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  Stack,
  Typography,
} from "@mui/material";
import InfiniteScroll from "react-infinite-scroll-component";

import Loading from "@/components/Loading";
import animalService from "@/utils/services/animalService";
import PetCard from "@/components/PetCard";
import MultipleSelect from "@/components/input/MultipleSelect";
import infoLists from "@/utils/lists";
import guiltService from "@/utils/services/guiltService";
import ScrollToTopButton from "@/components/ScrollToTopButton";
const quantityPerPage = 12;

export default function PetsPage() {
  const router = useRouter();
  const { getRecommendedAnimals, getUniqueAnimalTypes } = animalService();
  const currentUserId = useSelector((state) => state.currentUser.currentUserId); // get the current session user
  const currentUserType = useSelector((state) => state.currentUser.currentUserType);
  const { ageClassNames, sizeNames } = infoLists();

  const [animalData, setAnimalData] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [hasMore, setHasMore] = React.useState(true);

  const [existingSpecies, setExistingSpecies] = React.useState([]);
  const [existingBreeds, setExistingBreeds] = React.useState([]);
  const [existingStates, setExistingStates] = React.useState([]);

  const [speciesFilter, setSpeciesFilter] = React.useState([]);
  const [breedFilter, setBreedFilter] = React.useState([]);
  const [stateFilter, setStateFilter] = React.useState("");
  const [ageClassFilter, setAgeClassFilter] = React.useState([0, 3]);
  const [sizeFilter, setSizeFilter] = React.useState([0, 4]);
  const [sexFilter, setSexFilter] = React.useState([]);
  const [currentFilter, setCurrentFilter] = React.useState({ "pageSize": quantityPerPage });

  const grief = useSelector((state) => state.griefEngine.griefEngineEnabled);

  const {
    getDislikeCount,
    incrementDislikeCount,
    decrementDislikeCount,
    getEuthanizedPetIds,
    updateEuthanizedPetIds,
  } = guiltService();

  const [euthanizedPetIds, setEuthanizedPetIds] = React.useState(new Set());
  const [audio, setAudio] = React.useState(null);

  const playAudio = () => {
    if (audio) {
      console.log("Playing audio");
      audio.play();
    } else {
      console.log("No audio");
    }
  };

  const ageSliderMarks = [
    {
      value: 0,
      label: 'Baby',
    },
    {
      value: 1,
      label: 'Adolescent'
    },
    {
      value: 2,
      label: 'Adult'
    },
    {
      value: 3,
      label: 'Elderly',
    },
  ];

  const sizeSliderMarks = [
    {
      value: 0,
      label: 'XS',
    },
    {
      value: 1,
      label: 'S',
    },
    {
      value: 2,
      label: 'M',
    },
    {
      value: 3,
      label: 'L',
    },
    {
      value: 4,
      label: 'XL',
    },
  ];

  //get initial data. Have to do this separately, because infite scroll will only
  //load when you scroll to the bottom. This is why `page` starts at 1, if it started
  //at 0, there would be a chance that the first round of data would be fetched 2x
  React.useEffect(() => {
    if (grief) {
      async function grabAudio() {
        if (typeof window !== 'undefined') {
          setAudio(new Audio('/sounds/angel.mp3'));
        }
      }
      grabAudio();

      async function initializeGuiltData() {
        if (!currentUserId) return;
        if (!grief) return;
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
          console.error("Error fetching guilt data:", error);
        }
      }
      initializeGuiltData();
    } else {
      setEuthanizedPetIds(new Set());
    }

    async function load() {
      if (!currentUserId) return;
      await fetchAnimalTypes();
      await updateRequestFilter();
      await fetchFirstData();
    }
    load();
  }, [currentUserId, grief]);

  const fetchFirstData = async (filters = currentFilter) => {
    await getRecommendedAnimals(currentUserId, filters)
      .then((result) => {
        if (result != null) {
          if (result.length < 1) {
            setHasMore(false);
          } else {
            setAnimalData(result);
          }
        } else {
          console.error("There was an error fetching animal data, returned", result);
        }
      })
      .catch((error) => {
        console.error("There was an error fetching animal data:", error);
      });
  }

  //get data after first call, called by infinite scroll
  const fetchMoreData = async () => {
    if (animalData.length === 0) {
      return;
    }
    let previousIds = animalData.map(a => a.id);
    await getRecommendedAnimals(currentUserId, currentFilter, previousIds)
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

  //fetch the possible species, states, etc. the animal could be
  const fetchAnimalTypes = async () => {
    await getUniqueAnimalTypes()
      .then((result) => {
        if (result != null) {
          setExistingSpecies(result.existingSpecies);
          setExistingBreeds(result.existingBreeds);
          setExistingStates(result.existingStates);
        } else {
          console.error("There was an error fetching unique animal types, returned", result);
        }
      })
      .catch((error) => {
        console.error("There was an error fetching unique animal types:", error);
      });
  }

  // updates the filter object to have the most recent value in the input fields
  const updateRequestFilter = async () => {

    let newFilter = {
      "pageSize": quantityPerPage,
      "species": speciesFilter,
      "breeds": breedFilter,
      "state": stateFilter,
      "sizeRange": sizeFilter,
      "ageClassRange": ageClassFilter
    }
    //for the sexes, we need to convert it from a string to enum form
    let sexFilterEnum = [];
    sexFilter.forEach((item) => {
      let str = item.toUpperCase();
      str.replace(" ", "_");
      sexFilterEnum.push(str);
    })
    newFilter.allowedSexes = sexFilterEnum;

    await setCurrentFilter(newFilter);
    return newFilter;
  }

  //resets all form fields and returns an empty filter
  const resetRequestFilter = async () => {
    setSpeciesFilter([]);
    setBreedFilter([]);
    setSexFilter([]);
    setStateFilter("");
    setSizeFilter([0, sizeNames.length - 1]);
    setAgeClassFilter([0, ageClassNames.length - 1]);
    let newFilter = {
      "pageSize": quantityPerPage,
    }
    await setCurrentFilter(newFilter);
    return newFilter;
  }

  const resetAnimalData = async () => {
    await setAnimalData([]);
    await setHasMore(true);
    await setPage(1);
  }

  //what happens when you hit "search" on the filters
  const onFilterSearch = async () => {
    await resetAnimalData();
    const filter = await updateRequestFilter();
    await fetchFirstData(filter);
  }

  const onResetFilters = async () => {
    await resetAnimalData();
    const filter = await resetRequestFilter();
    await fetchFirstData(filter);
  }

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
          setEuthanizedPetIds(new Set(updatedEuthanizedIds));
          playAudio();
        }
      }
    } catch (error) {
      console.error("Error updating dislikes:", error);
    }
  };

  return (
    <>
      <Head>
        <title>Pets</title>
      </Head>

      <main>
        {/* Overall page stack */}
        <Stack
          sx={{
            paddingTop: 4
          }}
          alignItems="center"
          gap={2}
        >

          {/* Title section */}
          <Card
            sx={{
              width: "80%",
              position: "relative"
            }}
            elevation={4}
          >
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  width: "100%"
                }}
              >

                {/* Left Box for Typography, centered */}
                <Box
                  sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 1
                  }}
                >
                  <Typography variant="h3" align="center">
                    Find your pet
                  </Typography>
                  <Typography variant="body1" align="center" color="text.secondary">
                    Like or dislike a pet based on your preferences, WOOF will learn
                    as you go and show you more pets you may be interested in!
                  </Typography>
                </Box>

                {/* Right Box for Buttons, aligned to the right */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    gap: 2,
                    justifyContent: "flex-start"
                  }}
                >
                  {currentUserType === "Center" ? (
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => router.push(`/pets/new`)}
                      sx={{
                        width: 200,
                      }}
                    >
                      Post New Pet
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => router.push(`/pets/liked`)}
                        sx={{
                          width: 200,
                        }}
                      >
                        Liked Pets
                      </Button>
                    </>
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Stack for filters and pet listing */}
          <Stack direction="row" sx={{ width: "100%", height: "100%" }}>
            {/* Filter card */}
            <Card
              sx={{
                width: "20%",
                minWidth: "200px",
                minHeight: "60vh",
                maxHeight: "100vh",
                overflow: "auto",
                margin: "15px",
                padding: "15px",
                display: "flex",
                flexDirection: "column"
              }}
            >
              <Typography variant="h4">Fiters</Typography>
              <MultipleSelect
                name="Species"
                items={existingSpecies}
                selectedItems={speciesFilter}
                setSelectedItems={setSpeciesFilter}
                sx={{ width: "100%", mt: "15px" }}
              />
              <MultipleSelect
                name="Breed"
                items={existingBreeds}
                selectedItems={breedFilter}
                setSelectedItems={setBreedFilter}
                sx={{ width: "100%", mt: "15px" }}
              />
              <MultipleSelect
                name="Sex"
                items={["Male", "Female", "Neutered Male", "Spayed Female"]}
                selectedItems={sexFilter}
                setSelectedItems={setSexFilter}
                sx={{ width: "100%", mt: "15px" }}
              />
              <FormControl fullWidth sx={{ width: "100%", mt: "15px" }}>
                <InputLabel id="state-select-label">State</InputLabel>
                <Select
                  labelId="state-select-label"
                  id="state-select"
                  value={stateFilter}
                  label="State"
                  onChange={(event) => setStateFilter(event.target.value)}
                >
                  <MenuItem value={""}>Please Select</MenuItem>
                  {existingStates.map((state, index) => (
                    <MenuItem key={index} value={state}>{state}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Box sx={{ m: "15px" }}>
                <Typography variant="h7" color={"text.secondary"}>Age</Typography>
                <Slider
                  getAriaLabel={() => 'Age range'}
                  value={ageClassFilter}
                  onChange={(event, newValue) => {
                    setAgeClassFilter(newValue);
                  }}
                  valueLabelDisplay="off"
                  step={1}
                  marks={ageSliderMarks}
                  min={0}
                  max={ageClassNames.length - 1}
                />
              </Box>
              <Box sx={{ m: "15px" }}>
                <Typography variant="h7" color={"text.secondary"}>Size</Typography>
                <Slider
                  getAriaLabel={() => 'Size range'}
                  value={sizeFilter}
                  onChange={(event, newValue) => {
                    setSizeFilter(newValue);
                  }}
                  valueLabelDisplay="off"
                  step={1}
                  marks={sizeSliderMarks}
                  min={0}
                  max={sizeNames.length - 1}
                />
              </Box>
              <Box sx={{ mt: "20px", width: "100%", display: "flex", justifyContent: "space-between" }}>
                <Button variant="outlinedSecondary" onClick={onResetFilters}>Clear Filters</Button>
                <Button variant="containedPrimary" onClick={onFilterSearch}>Search Pets</Button>
              </Box>
            </Card>

            {/* Pet Listings */}
            <Box
              sx={{
                width: "70%",
                minHeight: "300px",
                marginTop: "30px",
              }}
            >
              {animalData.length < 1 && (
                <Box sx={{ width: "100%", textAlign: "center" }}>
                  <Typography variant="h4" sx={{ color: "text.secondary" }}>No Animals Found!</Typography>
                </Box>
              )}
              <InfiniteScroll
                dataLength={animalData.length}
                next={fetchMoreData}
                hasMore={hasMore}
                loader={<Loading doneLoading={!hasMore} page={page} />}
              >
                <Grid container spacing={4} sx={{ minHeight: "50px", padding: "10px" }}>
                  {animalData.map((pet) => (
                    <Grid item xs={11} sm={5} md={4} lg={4} key={pet.id}>
                      <Box
                        onClick={() => router.push(`/pets/${pet.id}`)}
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
              </InfiniteScroll>
            </Box>
          </Stack>

          <ScrollToTopButton />
        </Stack>
      </main>
    </>
  );
}
