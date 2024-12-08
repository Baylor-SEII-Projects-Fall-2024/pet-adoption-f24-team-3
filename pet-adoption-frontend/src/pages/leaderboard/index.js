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

export default function LeaderboardPage() {
  const router = useRouter();
  const [leaderboard, setLeaderboard] = useState([]);
  const [sortBy, setSortBy] = useState("kills"); // Default sorting criterion
  const [count, setCount] = useState(10); // Default count value
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const grief = useSelector((state) => state.griefEngine.griefEngineEnabled);
  const currentUserId = useSelector((state) => state.currentUser.currentUserId);
  const { getLeaderboard } = guiltService();

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

  useEffect(() => {
    fetchLeaderboard();
  }, [sortBy, count]); // Refetch leaderboard whenever `sortBy` or `count` changes

  useEffect(() => {
    if (!grief) {
      router.push("/pets");
    }
  }, [grief]);

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const handleCountChange = (event) => {
    setCount(event.target.value);
  };

  const getRowStyle = (entryId) => {
    return entryId === currentUserId ? { backgroundColor: "#a3b18a", color: 'white' } : {};
  };

  return (
    <>
      <Head>
        <title>Leaderboard</title>
        <meta name="description" content="View the leaderboard for grief stats." />
      </Head>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* Title and Filters Section */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h4" gutterBottom textAlign="center">
              Leaderboard
            </Typography>
            <Box sx={{ display: "flex", gap: 2, alignItems: "center", justifyContent: "center" }}>
              <FormControl variant="outlined" sx={{ minWidth: 200 }}>
                <InputLabel id="sortBy-label">Sort By</InputLabel>
                <Select
                  labelId="sortBy-label"
                  value={sortBy}
                  onChange={handleSortChange}
                  label="Sort By"
                >
                  <MenuItem value="kills">Kills</MenuItem>
                  <MenuItem value="dislikes">Dislikes</MenuItem>
                </Select>
              </FormControl>
              <FormControl variant="outlined" sx={{ minWidth: 200 }}>
                <InputLabel id="count-label">Entries Count</InputLabel>
                <Select
                  labelId="count-label"
                  value={count}
                  onChange={handleCountChange}
                  label="Entries Count"
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
        <Card>
          <CardContent>
            {loading && <CircularProgress />}
            {error && <Alert severity="error">{error}</Alert>}
            {!loading && !error && (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Rank</TableCell>
                    <TableCell>First Name</TableCell>
                    <TableCell>Last Name</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Kills</TableCell>
                    <TableCell>Dislikes</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {leaderboard.map((entry, index) => (
                    <TableRow
                      key={entry.potentialOwnerId}
                      sx={getRowStyle(entry.potentialOwnerId)} // Apply conditional styling based on user ID
                    >
                      {/* Display the rank based on the index */}
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{entry.firstName || "N/A"}</TableCell>
                      <TableCell>{entry.lastName || "N/A"}</TableCell>
                      <TableCell>{entry.userTitle}</TableCell>
                      <TableCell>{entry.killCount || 0}</TableCell>
                      <TableCell>{entry.numDislikes || 0}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </Container>
    </>
  );
}

