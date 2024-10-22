import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import {
    Button,
    Card,
    CardContent,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    Typography,
    TextField
} from '@mui/material';
import { useSelector } from 'react-redux';

import userService from "@/utils/services/userService";
import preferenceService from "@/utils/services/preferenceService";

export default function EditPreferencesPage() {
    const router = useRouter();
    const { userId } = router.query; //get user ID from the routing
    const currentUserId = useSelector((state) => state.currentUser.currentUserId); // get the current session user
    const { updatePreferences, getPreferences } = preferenceService();

    const [loading, setLoading] = useState(true);
    const [preferences, setPreferences] = useState(null);
    const [formError, setFormError] = useState(null);
    const [formSuccess, setFormSuccess] = useState();
    const [formData, setFormData] = useState({
        species: "",
        breed: "",
        sex: "",
        age: "",
        size: "",
        city: "",
        state: "",
    });

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleSelectChange = (event, fieldName) => {
        const { value } = event.target;
        setFormData((prevState) => ({ ...prevState, [fieldName]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await updatePreferences(formData, userId).then((userId) => {
                //if user id is not null, that is handled in the hook below
                if (userId !== null) {
                    setFormError(null);
                    setFormSuccess("Pet Preferences Saved!");
                } else {
                    setFormError("An error occured, try again!");
                    setFormSuccess(null);
                }
            });
        } catch (error) {
            console.error("Error: ", error);
            setFormError("An error occured saving your data.");
        }

    };

    useEffect(() => {
        if (userId && userId != currentUserId) {
            // If they try to access a different profile, route them back to theirs
            router.push(`/profile/${currentUserId}/preferences`);
        }
        if (userId) {
            const fetchUserPreferences = async () => {
                try {
                    const result = await getPreferences(userId);
                    if (result !== null) {
                        setPreferences(result);
                        setFormData((prevState) => ({
                            ...prevState,
                            ["species"]: result.species,
                        }));
                        setFormData((prevState) => ({
                            ...prevState,
                            ["breed"]: result.breed,
                        }));
                        setFormData((prevState) => ({
                            ...prevState,
                            ["sex"]: result.sex,
                        }));
                        setFormData((prevState) => ({
                            ...prevState,
                            ["age"]: result.age,
                        }));
                        setFormData((prevState) => ({
                            ...prevState,
                            ["size"]: result.size,
                        }));
                        setFormData((prevState) => ({
                            ...prevState,
                            ["city"]: result.city,
                        }));
                        setFormData((prevState) => ({
                            ...prevState,
                            ["state"]: result.state,
                        }));
                    }
                    // Set error state if not ok
                } catch (error) {
                    setFormError(
                        `Pet preferences could not be found for user ${userId}`
                    );
                } finally {
                    setLoading(false);
                }
            };
            fetchUserPreferences();
        }
    }, [userId]); // rerender if userId changes

    if (!loading) {
        return (
            <>
                <Head>
                    <title>Edit Preferences Page</title>
                </Head>

                <main>
                    <Stack sx={{ paddingTop: 4 }} alignItems="center" gap={2}>
                        <Card sx={{ width: 600 }} elevation={4}>
                            <CardContent>
                                <Typography variant="h3" align="center">
                                    Pet Preferences
                                </Typography>
                            </CardContent>
                        </Card>
                        <Stack direction="column">
                            <Card sx={{ minWidth: "60vw", p: "15px" }}>
                                <form onSubmit={handleSubmit}>

                                    <TextField
                                        fullWidth
                                        label="Pet Species"
                                        name="species"
                                        size="small"
                                        margin="dense"
                                        value={formData.species}
                                        onChange={handleFormChange}
                                    />

                                    <TextField
                                        fullWidth
                                        label="Pet Breed"
                                        name="breed"
                                        size="small"
                                        margin="dense"
                                        value={formData.breed}
                                        onChange={handleFormChange}
                                    />

                                    <FormControl fullWidth>
                                        <InputLabel id="sex-select-label">Pet Sex</InputLabel>
                                        <Select
                                            labelId="sex-select-label"
                                            id="sex-select"
                                            value={formData.sex}
                                            label="Pet Sex"
                                            onChange={(event) => handleSelectChange(event, 'sex')}
                                        >
                                            <MenuItem value={"MALE"}>Male</MenuItem>
                                            <MenuItem value={"FEMALE"}>Female</MenuItem>
                                        </Select>
                                    </FormControl>

                                    <FormControl fullWidth>
                                        <InputLabel id="age-select-label">Pet Age</InputLabel>
                                        <Select
                                            labelId="age-select-label"
                                            id="age-select"
                                            value={formData.age}
                                            label="Pet Age"
                                            onChange={(event) => handleSelectChange(event, 'age')}
                                        >
                                            <MenuItem value={"BABY"}>Baby</MenuItem>
                                            <MenuItem value={"ADOLESCENT"}>Adolescent</MenuItem>
                                            <MenuItem value={"ADULT"}>Adult</MenuItem>
                                            <MenuItem value={"OLD"}>Close to Euthenasia</MenuItem>
                                        </Select>
                                    </FormControl>

                                    <FormControl fullWidth>
                                        <InputLabel id="size-select-label">Pet Size</InputLabel>
                                        <Select
                                            labelId="size-select-label"
                                            id="breed-select"
                                            value={formData.size}
                                            label="Pet Size"
                                            onChange={(event) => handleSelectChange(event, 'size')}
                                        >
                                            <MenuItem value={"EXTRA_SMALL"}>Extra Small</MenuItem>
                                            <MenuItem value={"SMALL"}>Small</MenuItem>
                                            <MenuItem value={"MEDIUM"}>Medium</MenuItem>
                                            <MenuItem value={"LARGE"}>Large</MenuItem>
                                            <MenuItem value={"EXTRA_LARGE"}>Extra Large</MenuItem>
                                        </Select>
                                    </FormControl>

                                    <TextField
                                        fullWidth
                                        label="Pet City"
                                        name="city"
                                        size="small"
                                        margin="dense"
                                        value={formData.city}
                                        onChange={handleFormChange}
                                    />

                                    <TextField
                                        fullWidth
                                        label="Pet State"
                                        name="state"
                                        size="small"
                                        margin="dense"
                                        value={formData.state}
                                        onChange={handleFormChange}
                                    />

                                    <br></br>

                                    <Button type="submit" variant="contained" color="primary">
                                        Save
                                    </Button>

                                </form>

                                {formError && (
                                    <Typography color="error">{formError}</Typography>
                                )}
                                {formSuccess && (
                                    <Typography color="success">{formSuccess}</Typography>
                                )}
                            </Card>
                        </Stack>
                    </Stack>
                </main>
            </>
        );
    }
}
