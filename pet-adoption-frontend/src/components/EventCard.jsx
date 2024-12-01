import { Card, CardContent, Typography, Box } from "@mui/material";
import { format } from "date-fns";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function EventCard(props) {
  const { event } = props;
  return (
    <Card
      key={event.id}
      sx={{
        display: "flex",
        mb: 2,
        width: "100%",
        height: "440px",
      }}
    >
      <CardContent>
        <Box
          sx={{
            flex: 0.8,
            width: "100%",
            height: "300px",
            overflow: "hidden",
          }}
        >
          <img
            style={{
              width: "100%",
              maxHeight: "auto",
              borderRadius: "2%",
              aspectRatio: 1,
              objectFit: "cover",
            }}
            alt="Event Thumbnail"
            src={`${apiUrl}/api/images/events/${event.id}`}
          />
        </Box>
        <Box
          sx={{
            flex: 0.2,
          }}
        >
          <Typography variant="h5">{event.name}</Typography>
          {format(new Date(event.dateStart), "MM dd yyyy") ===
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
          )}
          {event.city && event.state && (
            <Typography>
              {event.city}, {event.state}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
