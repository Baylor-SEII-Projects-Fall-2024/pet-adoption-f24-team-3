import { Card, CardContent, Typography } from "@mui/material";

const TeamMemberCard = ({ member, role, imgLink, github }) => {
  return (
    <Card
      sx={{
        maxWidth: 300,
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: "0 6px 10px rgba(0, 0, 0, 0.2)",
        },
      }}
    >
      <a href={github}>
        <img
          src={imgLink}
          alt={member}
          style={{
            width: "100%",
            height: "auto",
            objectFit: "cover",
            borderTopLeftRadius: "8px",
            borderTopRightRadius: "8px",
          }}
        />
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {member}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {role}
          </Typography>
        </CardContent>
      </a>
    </Card>
  );
};

export default TeamMemberCard;
