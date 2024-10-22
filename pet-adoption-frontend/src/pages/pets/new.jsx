/**
 * File: pets/new.jsx
 * Author: Icko Iben
 * Date Created: 09/24/2024
 * Date Last Modified: 09/24/2024
 * */

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
    Stack,
    Select,
    Typography,
    TextField
} from '@mui/material';
import { useSelector } from 'react-redux';

import animalService from "@/utils/services/animalService";
import imageService from "@/utils/services/imageService";

// TODO How do we get centerid?
export default function PetsPage() {
    const router = useRouter();
    const { createPetPost } = animalService();
    const { uploadProfilePic } = imageService();

    const [petPicture, setPetPicture] = useState(null);
    const [isUploading, setIsUploading] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formError, setFormError] = useState(null);
    const [formSuccess, setFormSuccess] = useState();
    const [formData, setFormData] = useState({
        petName: "",
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

    const handleProfileImageUpload = (e) => {
        setProfileImage(e.target.files[0]);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const emptyFields = Object.keys(formData).filter(key => !formData[key]);

        if (emptyFields.length > 0) {
            const emptyFieldNames = emptyFields.map(field => {
                switch (field) {
                    case 'petName': return 'Pet Name';
                    case 'species': return 'Pet Species';
                    case 'breed': return 'Pet Breed';
                    case 'sex': return 'Sex';
                    case 'age': return 'Age';
                    case 'size': return 'Size';
                    case 'city': return 'City';
                    case 'state': return 'State';
                    default: return field;
                }
            });
            alert(`Please fill in the following fields: ${emptyFieldNames.join(', ')}`);
            return;
        }

        try {
            console.log("calling savePet")
            await savePet(formData, petPicture).then((petPostId) => {
                //if user id is not null, that is handled in the hook below
                if (petPostId !== null) {
                    setFormError(null);
                    setFormSuccess("Pet Post Saved!");
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

    return (
        <>
            <Head>
                <title>Create New Pet Post</title>
            </Head>

            <main>
                <Stack sx={{ paddingTop: 4 }} alignItems='center' gap={2}>
                    <Card sx={{ width: 600 }} elevation={4}>
                        <CardContent>
                            <Typography variant='h3' align='center'>New Pet Post</Typography>
                        </CardContent>
                    </Card>
                    <Stack direction="column">

                        <TextField
                            required
                            fullWidth
                            label="Pet Name"
                            name="petName"
                            size="small"
                            margin="dense"
                            value={formData.petName}
                            onChange={handleFormChange}
                        />

                        <TextField
                            required
                            fullWidth
                            label="Pet Species"
                            name="species"
                            size="small"
                            margin="dense"
                            value={formData.species}
                            onChange={handleFormChange}
                        />

                        <TextField
                            required
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
                                required
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
                                required
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
                                required
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
                            required
                            fullWidth
                            label="Pet City"
                            name="city"
                            size="small"
                            margin="dense"
                            value={formData.city}
                            onChange={handleFormChange}
                        />

                        <TextField
                            required
                            fullWidth
                            label="Pet State"
                            name="state"
                            size="small"
                            margin="dense"
                            value={formData.state}
                            onChange={handleFormChange}
                        />

                        <br></br>

                        <TextField
                            type="file"
                            label='Pet Picture'
                            name="petPicture"
                            size="small" margin="dense"
                            InputLabelProps={{ shrink: true }}
                            inputProps={{ accept: "image/png, image/gif, image/jpeg" }}
                            onChange={handleProfileImageUpload} />


                        {isUploading ?
                            <Typography>Creating Account...</Typography>
                            :
                            <Button type='submit' variant='contained' color='primary'>Save</Button>
                        }
                    </Stack>
                </Stack>
            </main>
        </>
    );
}
