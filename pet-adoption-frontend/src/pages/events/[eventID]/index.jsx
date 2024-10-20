import React from 'react';
import Head from 'next/head';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { Button, Card, CardContent, Stack, Typography, Box } from '@mui/material'
import eventService from '@/utils/services/eventService';
import userService from '@/utils/services/userService';
import { format } from 'date-fns';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;


export default function ViewEventPage() {
  const router = useRouter();
  const { eventID } = router.query;
  const currentUserId = useSelector((state) => state.currentUser.currentUserId); // get the current session user

  const { getEventInfo } = eventService();
  const { getCenterInfo } = userService();

  const [event, setEvent] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isError, setIsError] = React.useState(false);
  const [adoptionCenter, setAdoptioneCenter] = React.useState(null);

  React.useEffect(() => {
    if (eventID) {
      async function fetchEvent() {
        await getEventInfo(eventID)
          .then((result) => {
            if (result != null) {
              setEvent(result);
            }
            else {
              console.error(`Error loading event ${eventID}:`, result);
              setIsError(true);
            }

          })
          .catch((error) => {
            console.error(`Error loading event ${eventID}:`, error);
            setIsError(true);
          })
          .finally(() => {
            setIsLoading(false);
          })
      }
      fetchEvent();
    }
  }, [eventID]);

  React.useEffect(() => {
    const fetchCenterInfo = async () => {
      if (currentUserId) {
        try {
          const result = await getCenterInfo(currentUserId);
          if (result != null) {
            setAdoptioneCenter(result);
          } else {
            console.error(`Error loading center ${currentUserId}:`, result);
            setIsError(true);
          }
        } catch (error) {
          console.error(`Error loading center ${currentUserId}:`, error);
          setIsError(true);
        }
      }
    };
  
    fetchCenterInfo();
  }, [currentUserId]);
  

  if ((isLoading == true || !event) && !isError) {
    return (
      <>
        <Head>
          <title>View Event</title>
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
          <title>View Event</title>
        </Head>
        <main>
          <Stack sx={{ paddingTop: 4 }} alignItems='center' gap={2}>
            <Card sx={{ width: "75%" }} elevation={4}>
              <CardContent>
                <Typography variant='h5' align='center' color='text.error'>Error: Unable to load event. Please check again soon!</Typography>
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
        <title>{event.name}</title>
      </Head>

      <main>
        <Stack sx={{ paddingTop: 4 }} alignItems='center' gap={2}>
          <Card sx={{ width: "75%" }} elevation={4}>
            <CardContent>
              <Stack direction="row">
                <img
                  src={`${apiUrl}/api/images/events/${eventID}`}
                  alt={`${event.name}`}
                  style={{ maxWidth: "50%", maxHeight: "400px", borderRadius: "2%", marginRight: "30px" }}
                />
                <Stack direction="column">
                  <Typography variant='h3' >{event.name}</Typography>
                  <br></br>
                  <table>
                    <tbody>
                      <tr>
                        <td><Typography>Hosted By: </Typography></td>
                        <td><Typography>{adoptionCenter.name}</Typography></td>
                      </tr>
                      <tr>
                        <td> <Typography>Dates:</Typography> </td>
                        <td>
                            {event.dateStart && event.dateEnd &&
                              (format(new Date(event.dateStart), "MM dd yyyy") ===
                                format(new Date(event.dateEnd), "MM dd yyyy") ? (
                                <>
                                  <Typography>
                                    {format(new Date(event.dateStart), "MMM dd, yyyy")}
                                  </Typography>
                                  <Typography>
                                    {format(new Date(event.dateStart), "h:mm a")} -{" "}
                                    {format(new Date(event.dateEnd), "h:mm a")}
                                  </Typography>
                                </>
                              ) : (
                                <Typography>
                                  {format(new Date(event.dateStart), "MMM dd, yyyy")} -{" "}
                                  {format(new Date(event.dateEnd), "MMM dd, yyyy")}
                                </Typography>
                              ))}
                        </td>

                      </tr>
                    </tbody>
                  </table>
                </Stack>
                <Box>
                  {currentUserId == event.currentUserId && (
                    <Button
                      variant='contained'
                      color="secondary"
                      onClick={() => router.push(`/events/${eventID}/edit`)} sx={{ width: "150px" }}>Edit Event</Button>
                  )}
                </Box>
              </Stack>
              <Box
                sx={{
                  width: "80%",
                  ml: "auto",
                  mr: "auto",
                  mt: "30px"
                }}
              >
                <Typography align='center'>{event.description}</Typography>
              </Box>


            </CardContent>
          </Card>
        </Stack>
      </main>
    </>
  );
}
