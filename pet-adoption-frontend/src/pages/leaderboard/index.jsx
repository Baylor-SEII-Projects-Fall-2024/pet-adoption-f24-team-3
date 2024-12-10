import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import {
  Container,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Alert,
  Card,
  CardContent,
  Box
} from "@mui/material";
import { useSelector } from "react-redux";
import guiltService from "@/utils/services/guiltService";
import { set } from "date-fns";
import { zIndex } from "@mui/material/styles";

export default function LeaderboardPage() {
  const router = useRouter();
  const [leaderboard, setLeaderboard] = useState([]);
  const [playerReady, setPlayerReady] = useState(false);
  const [sortBy, setSortBy] = useState("kills"); // Default sorting criterion
  const [count, setCount] = useState(10); // Default count value
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const grief = useSelector((state) => state.griefEngine.griefEngineEnabled);
  const currentUserId = useSelector((state) => state.currentUser.currentUserId);
  const { getLeaderboard } = guiltService();
  const playerRef = React.useRef(null);

  const fetchLeaderboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getLeaderboard(sortBy, count);
      if (data) {
        setLeaderboard(data.entries);
      } else {
        setError("Failed to fetch leaderboard.");
      }
    } catch (error) {
      console.error(error);
      setError("An error occurred while fetching the leaderboard.");
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    primary: {
      backgroundColor: "#170b0b",
      color: "#890a0a",
      fontFamily: "monospace",
    },
    tableRow: {
      fontFamily: "monospace",
      "& .MuiTableCell-root": {
        color: "#7a0d0d", // Applies to all cells in the row
        borderBottom: "1px solid #3d3131",
        fontFamily: "monospace",
      },
      "&:hover": {
        animation: " scaleUp 0.1s ease-in-out forwards"
      },
    },
    tableRowSpecial: {
      backgroundColor: "#600101",
      fontFamily: "monospace",
      "& .MuiTableCell-root": {
        color: "white", // Applies to all cells in the row
        animation: "shake 1s infinite linear",
        color: "#000",
        borderBottom: "1px solid #3d3131",
        fontFamily: "monospace",
      },
      "&:hover": {
        animation: " scaleUp 0.2s ease-in-out forwards"
      },
    },
    tableHeader: {
      borderBottom: "1px solid #3d3131",
      fontFamily: "YouMurderer",
      fontSize: "3em",
    },
    menuItem: {
      backgroundColor: "#170b0b",
      color: "#a50c0c",
      fontFamily: "monospace",
    },
    select: {
      backgroundColor: "#170b0b",
      color: "#9d9d9d",
      border: "1px solid #2e2e2e",
      "&:hover": {
        backgroundColor: "#1b0d0d",
      },
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "#555",
      },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "#301515",
      },
      "& .MuiSvgIcon-root": {
        color: "#563b3b",
      },
    },
    selectLabel: {
      color: "#969696",
      fontFamily: "monospace",
      "&.Mui-focused": {
        color: "#ababab",
      },
    },
    menuItem: {
      PaperProps: {
        sx: {
          backgroundColor: "#333", // Background color of the dropdown
          color: "white", // Text color
          "& .MuiMenuItem-root": {
            "&:hover": {
              backgroundColor: "#444", // Hover color for menu items
            },
            "&.Mui-selected": {
              backgroundColor: "#555", // Background when selected
              "&:hover": {
                backgroundColor: "#666", // Hover on selected item
              },
            },
          },
        }
      }
    }
  }

  useEffect(() => {
    fetchLeaderboard();
  }, [sortBy, count]); // Refetch leaderboard whenever `sortBy` or `count` changes

  useEffect(() => {
    if (!grief && !loading) {
      router.push("/pets");
    }
  }, [grief, loading]);

  useEffect(() => {
    // Dynamically load the YouTube iframe API script
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    // Set this function once the YouTube iframe script is ready
    window.onYouTubeIframeAPIReady = () => {
      playerRef.current = new window.YT.Player("player", {
        height: "0", // Hidden visually
        width: "0",
        videoId: "wJWksPWDKOc", // Replace with your YouTube video ID
        playerVars: {
          autoplay: 1,
          mute: 1,
          loop: 1,
        },
        events: {
          onReady: onPlayerReady,
        },
      });
    };

    function onPlayerReady(event) {
      event.target.playVideo(); // Start video muted
    }

    return () => {
      // Cleanup the player properly when the component unmounts
      if (playerRef.current && playerRef.current.destroy) {
        playerRef.current.destroy();
      }
    };
  }, []);

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const handleCountChange = (event) => {
    setCount(event.target.value);
  };

  const getRowStyle = (entryId) => {
    return entryId === currentUserId ? styles.tableRowSpecial : styles.tableRow;
  };



  const handleUnmute = () => {
    if (
      playerRef.current &&
      typeof playerRef.current.unMute === "function" &&
      typeof playerRef.current.playVideo === "function"
    ) {
      playerRef.current.unMute();
      playerRef.current.playVideo();
    } else {
      console.error("Player is not ready or methods not available.");
    }
  };

  return (
    <>
      <Head>
        <title>Leaderboard</title>
        <meta name="description" content="View the leaderboard for grief stats." />
      </Head>
      <Box
        onClick={handleUnmute}
        sx={{
          backgroundImage: "url('/hallway.jpg')",
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          margin: 0,
          m: 0, pt: 4, pb: 4, minHeight: "100vh"
        }}>
        <Container maxWidth="lg" >
          {/* Title and Filters Section */}
          <Card sx={[styles.primary, { mb: 4, zIndex: "5" }]}>
            <CardContent>
              <Typography
                variant="h4"
                textAlign="center"
                sx={{
                  fontFamily: "YouMurderer",
                  fontSize: "5em"
                }}>
                &#123; Wall of Reckoning &#125;
              </Typography>
              <Box sx={{ display: "flex", gap: 2, alignItems: "center", justifyContent: "center" }}>
                <FormControl variant="outlined" sx={{ minWidth: 200 }}>
                  <InputLabel id="sortBy-label" sx={styles.selectLabel}>Sort By</InputLabel>
                  <Select
                    labelId="sortBy-label"
                    value={sortBy}
                    onChange={handleSortChange}
                    label="Sort By"
                    sx={styles.select}
                    MenuProps={styles.menuItem}
                  >
                    <MenuItem value="kills">Kills</MenuItem>
                    <MenuItem value="dislikes">Dislikes</MenuItem>
                  </Select>
                </FormControl>
                <FormControl variant="outlined" sx={{ minWidth: 200 }}>
                  <InputLabel id="count-label" sx={styles.selectLabel}>Entries Count</InputLabel>
                  <Select
                    labelId="count-label"
                    value={count}
                    onChange={handleCountChange}
                    label="Entries Count"
                    sx={styles.select}
                    MenuProps={styles.menuItem}
                  >
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={25}>25</MenuItem>
                    <MenuItem value={100}>100</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </CardContent>
          </Card>

          {/* Leaderboard Section */}
          <Card sx={styles.primary}>
            <CardContent>
              {loading && <CircularProgress sx={{ color: "#a50c0c" }} />}
              {error && <Alert severity="error">{error}</Alert>}
              {!loading && !error && (
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={[styles.primary, styles.tableHeader]}>Rank</TableCell>
                      <TableCell sx={[styles.primary, styles.tableHeader]}>Name</TableCell>
                      <TableCell sx={[styles.primary, styles.tableHeader]}>Title</TableCell>
                      <TableCell sx={[styles.primary, styles.tableHeader]}>Kills</TableCell>
                      <TableCell sx={[styles.primary, styles.tableHeader]}>Dislikes</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {leaderboard.map((entry, index) => (
                      <TableRow
                        key={entry.potentialOwnerId}
                        sx={getRowStyle(entry.potentialOwnerId)} // Apply conditional styling based on user ID
                      >
                        {/* Display the rank based on the index */}
                        <TableCell >{index + 1}</TableCell>
                        <TableCell >{entry.firstName || "N/A"} {entry.lastName}</TableCell>
                        <TableCell >{entry.userTitle}</TableCell>
                        <TableCell ><strong>{entry.killCount || 0}</strong></TableCell>
                        <TableCell ><strong>{entry.numDislikes || 0}</strong></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
          <Box
            variant="h4"
            textAlign="center"
            sx={{
              fontFamily: "YouMurderer",
              color: "#c30a0a",
              fontSize: "5em",
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.6)',
            }}>
            &#123; Their Blood is on your hands.
            <br />
            But their final howls are in <strong>our</strong> ears.
            <br />
            <Typography sx={{
              fontFamily: "YouMurderer",
              color: "#c30a0a",
              fontSize: "1.4em",
              position: "relative",
              animation: "shake 0.5s infinite linear"
            }}>WHAT HAVE YOU DONE?!</Typography>
          </Box>
        </Container>
        {/* Hidden iframe container */}
        <div id="player"></div>
      </Box >
    </>
  );
}

