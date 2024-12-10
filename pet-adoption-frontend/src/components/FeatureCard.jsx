import { Card, CardContent, Typography, Box } from "@mui/material";

export default function FeatureCard({ icon, title, description }) {
  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.3s ease-in-out",
        "&:hover": {
          transform: "translateY(-8px)",
        },
      }}
    >
      <CardContent>
        <Box
          sx={{
            fontSize: "2.5rem",
            textAlign: "center",
            mb: 2,
          }}
        >
          {icon}
        </Box>
        <Typography variant="h6" component="h3" gutterBottom align="center">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
}
