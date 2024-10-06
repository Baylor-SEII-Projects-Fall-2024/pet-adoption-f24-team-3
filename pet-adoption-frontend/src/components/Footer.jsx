import * as React from "react";
import { Box, Container, Grid, Typography } from "@mui/material";

export default function Footer(props) {
    return (
        <Box
            sx={{
                width: "100%",
                height: "auto",
                backgroundColor: "secondary.main",
                paddingTop: "1rem",
                paddingBottom: "1rem",
            }}
        >
            <Container maxWidth="lg">
                <Grid container direction="column" alignItems="center">
                    <Grid item xs={12}>
                        <Typography color="text.main" variant="h4">
                            WOOF Adoption Services
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography color="textSecondary" variant="subtitle1">
                            {`${new Date().getFullYear()} | CSI 3372`}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography color="textSecondary" variant="subtitle2">
                            Sam Fries
                            | Iko Iben
                            | Brendon Newton
                            | Logan Rigdon
                            | August Rothpletz
                        </Typography>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};
