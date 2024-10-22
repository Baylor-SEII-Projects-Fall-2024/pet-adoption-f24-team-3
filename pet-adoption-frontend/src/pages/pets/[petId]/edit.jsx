import animalService from '@/utils/services/animalService';
import React, { useEffect, useState } from "react";
import Head from 'next/head';
import { useRouter } from 'next/router';
import userService from "@/utils/services/userService";
import { Button, Card, CardContent, Stack, Typography, TextField } from '@mui/material'
import { useSelector } from "react-redux";
import { UploadFile } from '@mui/icons-material';
import { toFormData } from "axios";
export default function EditPetPage() {
  const router = useRouter();
  const { petId } = router.query; //get user ID from the routing
  const { getAnimal } = animalService();
  const [loading, setLoading] = useState(true);
  const currentUserId = useSelector((state) => state.currentUser.currentUserId); // get the current session user
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    species: "",
    breed: "",
    sex: "",
    description: "",
    picPath: "",
    size: "",
    ageClass: "",
    height: "",
    weight: "",
  });


  if(getAnimal(petId).centerId != currentUserId){
    return
  }
  useEffect(() => {
    if (centerId && centerId != currentUserId) {
      router.push(`/centers/${centerId}`);
    }
    if (centerId) {
      const fetchPetInfo = async () => {
        try {
          const result = await getAnimal(petId);
          if (result !== null) {
            setFormData(prevState => ({ ...prevState, ["name"]: result.name }));
            setFormData(prevState => ({ ...prevState, ["age"]: result.age }));
            setFormData(prevState => ({ ...prevState, ["species"]: result.species }));
            setFormData(prevState => ({ ...prevState, ["breed"]: result.breed }));
            setFormData(prevState => ({ ...prevState, ["sex"]: result.sex }));
            setFormData(prevState => ({ ...prevState, ["description"]: result.description }));
            setFormData(prevState => ({ ...prevState, ["picPath"]: result.picPath }));
            setFormData(prevState => ({ ...prevState, ["size"]: result.size }));
            setFormData(prevState => ({ ...prevState, ["ageClass"]: result.ageClass }));
            setFormData(prevState => ({ ...prevState, ["height"]: result.height }));
            setFormData(prevState => ({ ...prevState, ["weight"]: result.weight }));
          }
          // Set error state if not ok
        } catch (error) {
          setError(`User information could not be found for pet ${petId}`);
        } finally {
          setLoading(false);
        }
      };
      fetchPetInfo();
    }
  }, [petId]); // rerender if userId changes
  
  return (
    <>
      <Head>
        <title>Edit Pet</title>
      </Head>

      <main>
          <Stack sx={{ paddingTop: 4 }} alignItems="center" gap={2}>
            <Card sx={{ width: 600 }} elevation={4}>
              <CardContent>
                <Typography variant="h3" align="center">
                  Edit Pet
                </Typography>
              </CardContent>
            </Card>
            <Stack direction="column">
              <Card sx={{ width: "60vw", p: "15px" }}>
                <form id="Form" onSubmit={handleSubmit}>
                  <TextField
                    required
                    fullWidth
                    label="Name"
                    name="name"
                    size="small"
                    margin="dense"
                    value={formData.name}
                    onChange={handleChange}
                  />
                  <TextField
                    required
                    fullWidth
                    label="Age"
                    name="age"
                    size="small"
                    margin="dense"
                    value={formData.age}
                    onChange={handleChange}
                  />
                  <TextField
                    required
                    fullWidth
                    multiline
                    label="Species"
                    name="species"
                    size="small"
                    margin="dense"
                    value={formData.species}
                    onChange={handleChange}
                  />

                  <TextField
                    required
                    fullWidth
                    label="Breed"
                    name="breed"
                    size="small"
                    margin="dense"
                    value={formData.breed}
                    onChange={handleChange}
                  />
                  <TextField
                    required
                    fullWidth
                    label="Sex"
                    name="sex"
                    size="small"
                    margin="dense"
                    value={formData.sex}
                    onChange={handleChange}
                  />
                  <TextField
                    required
                    fullWidth
                    label="State"
                    name="state"
                    size="small"
                    margin="dense"
                    value={formData.state}
                    onChange={handleChange}
                  />
                  <TextField
                    required
                    fullWidth
                    label="Description"
                    name="description"
                    size="small"
                    margin="dense"
                    value={formData.description}
                    onChange={handleChange}
                  />
                  <TextField
                    required
                    fullWidth
                    label="Size"
                    name="size"
                    size="small"
                    margin="dense"
                    value={formData.size}
                    onChange={handleChange}
                  />
                  <TextField
                    required
                    fullWidth
                    label="Age Group"
                    name="ageClass"
                    size="small"
                    margin="dense"
                    value={formData.ageClass}
                    onChange={handleChange}
                  />
                  <TextField
                    required
                    fullWidth
                    label="Height"
                    name="height"
                    size="small"
                    margin="dense"
                    value={formData.height}
                    onChange={handleChange}
                  />
                  <TextField
                    required
                    fullWidth
                    label="Weight"
                    name="weight"
                    size="small"
                    margin="dense"
                    value={formData.weight}
                    onChange={handleChange}
                  />
                  <TextField
                    type="file"
                    label="Profile Picture"
                    name="picPath"
                    fullWidth
                    size="small"
                    margin="dense"
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ accept: "image/png, image/gif, image/jpeg" }}
                    onChange={handleProfileImageUpload}
                  />
                  <Button type="submit" variant="contained" color="primary">
                    Save
                  </Button>
                </form>
                <label id="errorLabel"></label>
              </Card>
            </Stack>
          </Stack>
        </main>
    </>
  );
}
