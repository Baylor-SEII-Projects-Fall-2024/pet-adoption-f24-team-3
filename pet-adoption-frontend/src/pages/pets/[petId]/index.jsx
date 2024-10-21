import React from 'react';
import Head from 'next/head';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { Button, Card, CardContent, Stack, Typography, Box } from '@mui/material'
import animalService from '@/utils/services/animalService';
import formatter from '@/utils/formatter';
const apiUrl = process.env.NEXT_PUBLIC_API_URL;


export default function ViewPetPage() {
  const router = useRouter();
  const { petId } = router.query; //get pet ID from the routing
  const currentUserId = useSelector((state) => state.currentUser.currentUserId); // get the current session user

  const { getAnimal, deleteAnimal } = animalService();
  const { formatSize, formatSex } = formatter();

  const [animal, setAnimal] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isError, setIsError] = React.useState(false);

  const onDeleteAnimal = async () => {
    if (!animal) return;

    if (window.confirm(`Are you sure you want to delete ${animal.name}? They will be gone forever...`)) {
      await deleteAnimal(petId)
        .then((result) => {
          if (result == true) {
            router.push(`/pets`)
          }
          else console.error("There was an error deleting this animal!");
        })
        .catch((error) => {
          console.error("There was an error deleting animal:", error);
        });
    }
  }

  React.useEffect(() => {
    if (petId) {
      async function fetchAnimal() {
        await getAnimal(petId)
          .then((result) => {
            if (result != null) {
              setAnimal(result);
            }
            else {
              console.error(`Error loading animal ${petId}:`, result);
              setIsError(true);
            }

          })
          .catch((error) => {
            console.error(`Error loading animal ${petId}:`, error);
            setIsError(true);
          })
          .finally(() => {
            setIsLoading(false);
          })
      }
      fetchAnimal();
    }
  }, [petId]);

  if ((isLoading == true || !animal) && !isError) {
    return (
      <>
        <Head>
          <title>View Pet</title>
        </Head>
        <main>
          <Stack sx={{ paddingTop: 4 }} alignItems='center' gap={2}>
            <Card sx={{ width: "75%" }} elevation={4}>
              <CardContent>
                <Typography variant='h3' align='center'>Loading...</Typography>
              </CardContent>
            </Card>
          </Stack>
        </main>
      </>
    )
  }

  if (isError) {
    return (
      <>
        <Head>
          <title>View Pet</title>
        </Head>
        <main>
          <Stack sx={{ paddingTop: 4 }} alignItems='center' gap={2}>
            <Card sx={{ width: "75%" }} elevation={4}>
              <CardContent>
                <Typography variant='h5' align='center' color='text.error'>Error: Unable to load animal. Please check again soon!</Typography>
              </CardContent>
            </Card>
          </Stack>
        </main>
      </>
    )
  }


  return (
    <>
      <Head>
        <title>{animal.name}</title>
      </Head>

      <main>
        <Stack sx={{ paddingTop: 4 }} alignItems='center' gap={2}>
          <Card sx={{ width: "75%" }} elevation={4}>
            <CardContent>
              <Stack direction="row">
                <img
                  src={`${apiUrl}/api/images/animals/${petId}`}
                  alt={`${animal.name}`}
                  style={{ maxWidth: "50%", maxHeight: "400px", borderRadius: "2%", marginRight: "30px" }}
                />
                <Stack direction="column" sx={{ display: "flex", flex: 1 }}>
                  <Typography variant='h3' >{animal.name}</Typography>
                  <br></br>
                  <table>
                    <tbody>
                      <tr>
                        <td> <Typography>Species:</Typography> </td>
                        <td> <Typography>{animal.species}</Typography></td>
                      </tr>
                      <tr>
                        <td> <Typography>Breed:</Typography> </td>
                        <td> <Typography>{animal.breed}</Typography></td>
                      </tr>
                      <tr>
                        <td> <Typography>Size:</Typography> </td>
                        <td> <Typography>{formatSize(animal.size)}</Typography></td>
                      </tr>
                      <tr>
                        <td> <Typography>Age:</Typography> </td>
                        <td> <Typography>{animal.age}</Typography></td>
                      </tr>
                      <tr>
                        <td> <Typography>Sex:</Typography> </td>
                        <td> <Typography>{formatSex(animal.sex)}</Typography></td>
                      </tr>
                      <tr>
                        <td> <Typography>Height:</Typography> </td>
                        <td> <Typography>{animal.height} inches</Typography></td>
                      </tr>
                      <tr>
                        <td> <Typography>Weight:</Typography> </td>
                        <td> <Typography>{animal.weight} lbs</Typography></td>
                      </tr>
                    </tbody>
                  </table>
                </Stack>
                {currentUserId == animal.centerId && (
                  <Box
                    sx={{ width: "150px", alignItems: "left" }}>
                    <Button
                      variant='contained'
                      color="secondary"
                      onClick={() => router.push(`/pets/${petId}/edit`)} sx={{ width: "150px" }}>Edit Pet</Button>
                    <Button
                      variant='outlined'
                      color="secondary"
                      onClick={onDeleteAnimal} sx={{ width: "150px" }}>Delete Pet</Button>
                  </Box>
                )}
              </Stack>
              <Box
                sx={{
                  width: "80%",
                  ml: "auto",
                  mr: "auto",
                  mt: "30px"
                }}
              >
                <Typography>{animal.description}</Typography>
              </Box>


            </CardContent>
          </Card>
        </Stack>
      </main>
    </>
  );
}
