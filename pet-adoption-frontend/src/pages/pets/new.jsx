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
    const { createPet } = animalService();
    const currentUserId = useSelector((state) => state.currentUser.currentUserId); // get the current session user

    const [petPicture, setPetPicture] = useState(null);
    const [isUploading, setIsUploading] = useState(null);
    const [formError, setFormError] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        species: "",
        breed: "",
        age: "",
        sex: "",
        ageClass: "",
        size: "",
        height: "",
        weight: "",
        description: "",
        centerId: currentUserId,
    });

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleSelectChange = (event, fieldName) => {
        const { value } = event.target;
        setFormData((prevState) => ({ ...prevState, [fieldName]: value }));
    };

    const handlePetImageUpload = (e) => {
        setPetPicture(e.target.files[0]);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const emptyFields = Object.keys(formData).filter(key => !formData[key]);

        if (emptyFields.length > 0) {
            const emptyFieldNames = emptyFields.map(field => {
                switch (field) {
                    case 'name': return 'Name';
                    case 'species': return 'Pet Species';
                    case 'breed': return 'Pet Breed';
                    case 'sex': return 'Sex';
                    case 'ageClass': return 'Age Class';
                    case 'age': return 'Age';
                    case 'size': return 'Size';
                    case 'height': return 'Height';
                    case 'weight': return 'Weight';
                    case 'description': return "Description"
                    default: return field;
                }
            });
            alert(`Please fill in the following fields: ${emptyFieldNames.join(', ')}`);
            return;
        }

        try {
            setIsUploading(true);
            await createPet(formData, petPicture).then((result) => {
                //if user id is not null, that is handled in the hook below
                if (result !== null) {
                    setFormError(null);
                    setIsUploading(false);
                    router.push(`/pets/${result.id}`);
                } else {
                    setFormError("An error occured, try again!");
                    setIsUploading(false);
                }
            });
        } catch (error) {
            console.error("Error: ", error);
            setIsUploading(false);
            setFormError("An error occured saving your data.");
        }

    };

    return (
        <>
            <Head>
                <title>New Pet</title>
            </Head>

            <main>
                <Stack sx={{ paddingTop: 4 }} alignItems='center' gap={2}>
                    <Card sx={{ width: 600 }} elevation={4}>
                        <CardContent>
                            <Typography variant='h3' align='center'>Post New Pet</Typography>
                            <Stack direction="column">

                                <TextField
                                    required
                                    fullWidth
                                    label="Name"
                                    name="name"
                                    size="small"
                                    margin="dense"
                                    value={formData.name}
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

                                <FormControl fullWidth sx={{ mt: "10px", mb: "10px" }}>
                                    <InputLabel id="sex-select-label">Pet Sex</InputLabel>
                                    <Select
                                        required
                                        labelId="sex-select-label"
                                        id="sex-select"
                                        value={formData.sex}
                                        label="Pet Sex"
                                        size="small"
                                        onChange={(event) => handleSelectChange(event, 'sex')}
                                    >
                                        <MenuItem value={"MALE"}>Male</MenuItem>
                                        <MenuItem value={"FEMALE"}>Female</MenuItem>
                                    </Select>
                                </FormControl>

                                <TextField
                                    required
                                    fullWidth
                                    type="number"
                                    label="Age"
                                    name="age"
                                    size="small"
                                    value={formData.age}
                                    onChange={handleFormChange}
                                />

                                <FormControl fullWidth sx={{ mt: "10px", mb: "10px" }}>
                                    <InputLabel id="age-class-select-label">Pet Age Class</InputLabel>
                                    <Select
                                        required
                                        labelId="age-class-select-label"
                                        id="age-class-select"
                                        name="ageClass"
                                        value={formData.ageClass}
                                        size="small"
                                        margin="dense"
                                        onChange={(event) => handleSelectChange(event, 'ageClass')}
                                    >
                                        <MenuItem value={"BABY"}>Baby</MenuItem>
                                        <MenuItem value={"ADOLESCENT"}>Adolescent</MenuItem>
                                        <MenuItem value={"ADULT"}>Adult</MenuItem>
                                        <MenuItem value={"OLD"}>Elderly</MenuItem>
                                    </Select>
                                </FormControl>

                                <FormControl fullWidth sx={{ mt: "10px", mb: "10px" }}>
                                    <InputLabel id="size-select-label">Pet Size</InputLabel>
                                    <Select
                                        required
                                        labelId="size-select-label"
                                        id="breed-select"
                                        value={formData.size}
                                        size="small"
                                        margin="dense"
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
                                    type="number"
                                    label="Height (in)"
                                    name="height"
                                    size="small"
                                    margin="dense"
                                    value={formData.height}
                                    onChange={handleFormChange}
                                />
                                <TextField
                                    required
                                    fullWidth
                                    type="number"
                                    label="Weight (lbs)"
                                    name="weight"
                                    size="small"
                                    margin="dense"
                                    value={formData.weight}
                                    onChange={handleFormChange}
                                />

                                <TextField
                                    required
                                    fullWidth
                                    multiline
                                    rows={3}
                                    label="Description"
                                    name="description"
                                    size="small"
                                    margin="dense"
                                    value={formData.description}
                                    onChange={handleFormChange}
                                />

                                <TextField
                                    type="file"
                                    label='Pet Picture'
                                    name="petPicture"
                                    size="small" margin="dense"
                                    InputLabelProps={{ shrink: true }}
                                    inputProps={{ accept: "image/png, image/gif, image/jpeg" }}
                                    onChange={handlePetImageUpload} />


                                {isUploading ?
                                    <Typography>Creating Pet...</Typography>
                                    :
                                    <Button
                                        type='submit' variant='contained' color='primary'
                                        onClick={handleSubmit}
                                    >Save</Button>
                                }
                            </Stack>
                        </CardContent>
                    </Card>
                </Stack>

            </main>
        </>
    );
}
