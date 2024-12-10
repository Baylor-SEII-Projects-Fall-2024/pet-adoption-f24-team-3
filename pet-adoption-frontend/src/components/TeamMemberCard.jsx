import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Box,
  styled,
} from "@mui/material";
import { GitHub, LinkedIn } from "@mui/icons-material";

const StyledCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  transition: "transform 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: theme.shadows[8],
  },
}));

export default function TeamMemberCard({
  member,
  role,
  description,
  imgLink,
  github,
  linkedin,
}) {
  return (
    <StyledCard>
      <CardMedia
        component="img"
        height="300"
        image={imgLink}
        alt={member}
        sx={{
          objectFit: "cover",
          objectPosition: "center",
        }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" gutterBottom>
          {member}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          {role}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
      <Box sx={{ p: 2, display: "flex", justifyContent: "center", gap: 2 }}>
        {github && (
          <IconButton href={github} target="_blank" aria-label="GitHub">
            <GitHub />
          </IconButton>
        )}
        {linkedin && (
          <IconButton href={linkedin} target="_blank" aria-label="LinkedIn">
            <LinkedIn />
          </IconButton>
        )}
      </Box>
    </StyledCard>
  );
}
