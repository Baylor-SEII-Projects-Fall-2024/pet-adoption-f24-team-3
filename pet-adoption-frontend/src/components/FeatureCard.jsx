import { Card, CardContent, Typography } from "@mui/material";

export default function FeatureCard(props) {
  const { feature } = props;

  return (
    <Card
      sx={{
        maxWidth: 250,
        boxShadow: 3,
        borderRadius: 2,
        padding: 2,
        transition: "transform 0.3s ease-in-out",
        "&:hover": {
          transform: "scale(1.05)",
          boxShadow: 6,
        },
      }}
    >
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
          {feature}
        </Typography>
      </CardContent>
    </Card>
  );
}
