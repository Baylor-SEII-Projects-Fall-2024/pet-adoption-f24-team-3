import formatter from "@/utils/formatter";
import { Card, CardContent, Typography } from "@mui/material";
import { format } from "date-fns";

export default function TabPetCard(props) {
  const { pet } = props;
  const { camelCaseToReadable } = formatter();
  return (
    <>
      <Card key={pet.id} sx={{ marginBottom: 2 }}>
        <CardContent>
          <Typography variant="h5">{pet.name}</Typography>
          <Typography variant="body2" color="textSecondary">
            {pet.description}
          </Typography>
          {Object.entries(pet).map(([key, value]) => {
            if (key !== "name" && key !== "description") {
              return (
                <Typography key={key} variant="body2" color="textSecondary">
                  {`${camelCaseToReadable(key)}: ${
                    key === "datePosted"
                      ? format(new Date(value), "MMMM dd, yyyy")
                      : value === null
                      ? "N/A"
                      : value
                  }`}
                </Typography>
              );
            }
            return null;
          })}
        </CardContent>
      </Card>
    </>
  );
}
