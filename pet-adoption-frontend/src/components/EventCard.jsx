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
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Avatar
            variant="rounded"
            sx={{
              width: "100%",
              height: "100%",
              border: "2px solid #000",
              mt: 1,
              mb: 1,
            }}
            alt="Event Avatar"
            src={"/defaults/event.png"}
          />
        </Box>
        <Box>
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
