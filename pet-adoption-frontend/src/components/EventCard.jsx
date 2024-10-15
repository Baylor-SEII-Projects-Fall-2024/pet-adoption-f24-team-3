import { Card, CardContent, Typography, Box, Avatar } from "@mui/material";
import formatter from "@/utils/formatter";
import { format } from "date-fns";

export default function EventCard(props) {
  const { camelCaseToReadable } = formatter();
  const { event } = props;
  const attributesExcluded = ["name", "description", "datePosted"];
  const dateAttributes = ["dateStart", "dateEnd"];
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
          }}
        >
          <img
            style={{
              width: "100%",
              maxHeight: "auto",
              borderRadius: "2%",
              aspectRatio:1,
              objectFit:"cover",
            }}
            alt="Event Thumbnail"
            src={`http://localhost:8080/api/images/events/${event.id}`}
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
        </Box>
      </CardContent>
    </Card>
  );
}
