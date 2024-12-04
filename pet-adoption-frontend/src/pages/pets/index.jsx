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
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import InfiniteScroll from "react-infinite-scroll-component";

import Loading from "@/components/Loading";
import animalService from "@/utils/services/animalService";
import PetCard from "@/components/PetCard";
import MultipleSelect from "@/components/input/MultipleSelect";
import infoLists from "@/utils/lists";
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
    async function load() {
      if (!currentUserId) return;
      await fetchAnimalTypes();
      await updateRequestFilter();
      await fetchFirstData();
    }
    load();
  }, [currentUserId]);

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
          <Stack direction="row" sx={{ width: "100%", height: "100%" }}>
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
                        <PetCard pet={pet} />
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </InfiniteScroll>
            </Box>
          </Stack>
        </Stack>
      </main>
    </>
  );
}
