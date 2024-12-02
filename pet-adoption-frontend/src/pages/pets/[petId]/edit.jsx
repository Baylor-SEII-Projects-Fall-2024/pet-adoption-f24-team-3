import animalService from '@/utils/services/animalService';
import React, { useEffect, useState } from "react";
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Button, Card, CardContent, Stack, Typography, TextField, Select, MenuItem, InputLabel } from '@mui/material'
import { useSelector } from "react-redux";

export default function EditPetPage() {
  const router = useRouter();
  const { petId } = router.query; //get user ID from the routing
  const { getAnimal, updateAnimal } = animalService();
  const [loading, setLoading] = useState(true);
  const currentUserId = useSelector((state) => state.currentUser.currentUserId); // get the current session user

  const fieldRegex = RegExp('[^a-zA-Z]');

  const [imageFile, setImageFile] = useState(null);
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState();
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    species: "",
    breed: "",
    sex: "",
    description: "",
    size: "",
    ageClass: "",
    height: "",
    weight: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormError(null);
    setFormSuccess(null);
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleImageUpload = (e) => {
    setImageFile(e.target.files[0]);
  };

  //handle what happens on sumbmit. Does not reroute on success.
  const handleSubmit = async (e) => {
    e.preventDefault();
    for(let field in formData){
      if((field=="name" || field=="breed"|| field=="species") 
              && fieldRegex.test(formData[field])){
          setFormError(`${field} has special characters!`); 
          return;
      }
    }
    try {
      await updateAnimal(formData, imageFile, petId)
        .then((petId) => {
          //if user id is not null, that is handled in the hook below
          if (petId !== null) {
            setFormError(null);
            setFormSuccess("Pet Settings Saved!");
          }
          else {
            setFormSuccess(null);
            setFormError("An error occured, try again!");
          }
        })


    } catch (error) {
      console.error("Error: ", error);
      alert("An error occured saving data.");
    }
  };

  useEffect(() => {
    if (petId) {
      const fetchPetInfo = async () => {
        try {
          const result = await getAnimal(petId);
          if (result !== null) {
            // reroute if they shouldn't have access to edit this
            if(result.centerId != currentUserId){
              router.push(`/pets/${petId}`);
            }
            setFormData(prevState => ({ ...prevState, ["name"]: result.name }));
            setFormData(prevState => ({ ...prevState, ["age"]: result.age }));
            setFormData(prevState => ({ ...prevState, ["species"]: result.species }));
            setFormData(prevState => ({ ...prevState, ["breed"]: result.breed }));
            setFormData(prevState => ({ ...prevState, ["sex"]: result.sex }));
            setFormData(prevState => ({ ...prevState, ["description"]: result.description }));
            setFormData(prevState => ({ ...prevState, ["size"]: result.size }));
            setFormData(prevState => ({ ...prevState, ["ageClass"]: result.ageClass }));
            setFormData(prevState => ({ ...prevState, ["height"]: result.height }));
            setFormData(prevState => ({ ...prevState, ["weight"]: result.weight }));
          }
          // Set error state if not ok
        } catch (error) {
          setError(`Information could not be found for pet ${petId}`);
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
                <InputLabel id="sex-label">Sex</InputLabel>
                <Select
                  labelId="sex-label"
                  name="sex"
                  required
                  fullWidth
                  size="small"
                  margin="dense"
                  value={formData.sex}
                  onChange={handleChange}
                >
                  <MenuItem value={"MALE"}>Male</MenuItem>
                  <MenuItem value={"FEMALE"}>Female</MenuItem>
                </Select>
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
                <InputLabel id="size-label">Size</InputLabel>
                <Select
                  labelId="size-label"
                  name="size"
                  required
                  fullWidth
                  size="small"
                  margin="dense"
                  value={formData.size}
                  onChange={handleChange}
                >
                  <MenuItem value={"EXTRA_SMALL"}>Extra Small</MenuItem>
                  <MenuItem value={"SMALL"}>Small</MenuItem>
                  <MenuItem value={"MEDIUM"}>Medium</MenuItem>
                  <MenuItem value={"LARGE"}>Large</MenuItem>
                  <MenuItem value={"EXTRA_LARGE"}>Extra Large</MenuItem>
                </Select>
                <InputLabel id="age-group-label">Age Group</InputLabel>
                <Select
                  labelId="age-group-label"
                  name="ageClass"
                  required
                  fullWidth
                  size="small"
                  margin="dense"
                  value={formData.ageClass}
                  onChange={handleChange}
                >
                  <MenuItem value={"BABY"}>Baby</MenuItem>
                  <MenuItem value={"ADOLESCENT"}>Adolescent</MenuItem>
                  <MenuItem value={"ADULT"}>Adult</MenuItem>
                  <MenuItem value={"OLD"}>Old</MenuItem>
                </Select>
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
                  onChange={handleImageUpload}
                />
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
