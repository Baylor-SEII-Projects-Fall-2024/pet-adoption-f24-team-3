import { Card, CardContent, Typography } from "@mui/material";
import formatter from "@/utils/formatter";
import { format } from "date-fns";

export default function TabEventCard(props) {
  const { camelCaseToReadable } = formatter();
  const { event } = props;
  const attributesExcluded = ["name", "description", "datePosted"];
  const dateAttributes = ["dateStart", "dateEnd"];
  return (
    <>
      <Card key={event.id} sx={{ marginBottom: 2 }}>
        <CardContent>
          <Typography variant="h5">{event.name}</Typography>
          <Typography variant="body1" color="textSecondary">
            {event.description}
          </Typography>
          {Object.entries(event).map(([key, value]) => {
            if (!attributesExcluded.includes(key)) {
              return (
                <Typography key={key} variant="body2" color="textSecondary">
                  {`${camelCaseToReadable(key)}: ${
                    dateAttributes.includes(key)
                      ? format(new Date(value), "MMMM dd, yyyy")
                      : value === null
                      ? "N/A"
                      : value
                  }`}
                </Typography>
              );
            }
          })}
        </CardContent>
      </Card>
    </>
  );
}
