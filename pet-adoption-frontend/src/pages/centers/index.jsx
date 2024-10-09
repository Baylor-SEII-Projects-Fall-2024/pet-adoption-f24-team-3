import React from "react";
import { useRouter } from "next/router";
import { Box, Tabs, Tab, Typography, Card, CardContent } from "@mui/material";
import userService from "@/utils/services/userService";

// Custom TabPanel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const { userId } = router.query; //get user ID from the routing
  const { getCenterAnimals } = userService();

  const [value, setValue] = React.useState("one");

  // Sample pet data
  const pets = [
    { id: 1, name: "Buddy", description: "A friendly dog" },
    { id: 2, name: "Mittens", description: "A cute cat" },
  ];

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Tabs
        value={value}
        onChange={handleChange}
        textColor="secondary"
        indicatorColor="secondary"
        aria-label="pets and events tabs"
      >
        <Tab value="one" label="Events" />
        <Tab value="two" label="Pets" />
      </Tabs>
      <TabPanel value={value} index="one">
        {/* Content for Events */}
        <Typography>Events content goes here.</Typography>
      </TabPanel>
      <TabPanel value={value} index="two">
        {/* Content for Pets */}
        {pets.map((pet) => (
          <Card key={pet.id} sx={{ marginBottom: 2 }}>
            <CardContent>
              <Typography variant="h5">{pet.name}</Typography>
              <Typography variant="body2" color="textSecondary">
                {pet.description}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </TabPanel>
    </Box>
  );
}
