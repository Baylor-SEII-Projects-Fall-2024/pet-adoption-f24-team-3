import { Card, CardContent, Typography } from "@mui/material";

export default function FeatureCard(props) {
  const { feature } = props;
  return (
    <Card sx={{ maxWidth: 250 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {feature}
        </Typography>
      </CardContent>
    </Card>
  );
}
