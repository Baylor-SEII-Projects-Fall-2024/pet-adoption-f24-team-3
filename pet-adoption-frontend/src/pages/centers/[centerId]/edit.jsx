import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import userService from "@/utils/services/userService";
import {
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
  TextField,
  Select,
  FormControl,
  MenuItem,
  InputLabel,
} from "@mui/material";
import { useSelector } from "react-redux";
import infoLists from "@/utils/lists";

export default function EditProfilePage() {
  const router = useRouter();
  const { centerId } = router.query; // get user ID from the routing
  const currentUserId = useSelector((state) => state.currentUser.currentUserId); // get the current session user
  const { updateCenter, getCenterInfo } = userService();
  const { stateNames } = infoLists();

  const usernameRegex = RegExp('[^ a-zA-Z]');

  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [bannerImage, setBannerImage] = useState(null);
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState();
  const [formData, setFormData] = useState({
    accountType: "",
    emailAddress: "",
    profilePicPath: null,
    name: "",
    description: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  });

  const handleSelectChange = (event, fieldName) => {
    const { value } = event.target;
    setFormData((prevState) => ({ ...prevState, [fieldName]: value }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormError(null);
    setFormSuccess(null);
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleProfileImageUpload = (e) => {
    setProfileImage(e.target.files[0]);
  };
  const handleBannerImageUpload = (e) => {
    setBannerImage(e.target.files[0]);
  };

  //handle what happens on sumbmit. Does not reroute on success.
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(usernameRegex.test(formData.name)){
        setFormError("Name contains special characters!");
        return;
    }
    
    try {
      await updateCenter(formData, profileImage, bannerImage, centerId).then(
        (centerId) => {
          //if user id is not null, that is handled in the hook below
          if (centerId !== null) {
            setFormError(null);
            setFormSuccess("Saving changes...");
            router.push(`/centers/${currentUserId}`);
          } else {
            setFormError("An error occured, try again!");
            setFormSuccess(null);
          }
        }
      );
    } catch (error) {
      console.error("Error: ", error);
      alert("An error occured saving data.");
    }
  };
  useEffect(() => {
    if (centerId && centerId != currentUserId) {
      router.push(`/centers/${centerId}`);
    }
    if (centerId) {
      const fetchUserInfo = async () => {
        try {
          const result = await getCenterInfo(centerId);
          if (result !== null) {
            setUserInfo(result);

            setFormData((prevState) => ({
              ...prevState,
              ["accountType"]: result.accountType,
            }));
            setFormData((prevState) => ({
              ...prevState,
              ["emailAddress"]: result.emailAddress,
            }));
            setFormData((prevState) => ({
              ...prevState,
              ["name"]: result.name,
            }));
            setFormData((prevState) => ({
              ...prevState,
              ["description"]: result.description,
            }));
            setFormData((prevState) => ({
              ...prevState,
              ["address"]: result.address,
            }));
            setFormData((prevState) => ({
              ...prevState,
              ["city"]: result.city,
            }));
            setFormData((prevState) => ({
              ...prevState,
              ["state"]: result.state,
            }));
            setFormData((prevState) => ({
              ...prevState,
              ["zipCode"]: result.zipCode,
            }));
          }
          // Set error state if not ok
        } catch (error) {
          setError(`User information could not be found for user ${centerId}`);
        } finally {
          setLoading(false);
        }
      };
      fetchUserInfo();
    }
  }, [centerId]); // rerender if userId changes
  if (!loading) {
    return (
      <>
        <Head>
          <title>Edit Profile Page</title>
        </Head>

        <main>
          <Stack sx={{ paddingTop: 4 }} alignItems="center" gap={2}>
            <Card sx={{ width: 600 }} elevation={4}>
              <CardContent>
                <Typography variant="h3" align="center">
                  Profile Settings
                </Typography>
              </CardContent>
            </Card>
            <Stack direction="column">
              <Card sx={{ width: "60vw", p: "15px" }}>
                <form id="Form" onSubmit={handleSubmit}>
                  <TextField
                    required
                    fullWidth
                    label="Email"
                    name="emailAddress"
                    size="small"
                    margin="dense"
                    value={formData.emailAddress}
                    onChange={handleChange}
                  />
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
                    fullWidth
                    multiline
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
                    label="Address"
                    name="address"
                    size="small"
                    margin="dense"
                    value={formData.address}
                    onChange={handleChange}
                  />
                  <TextField
                    required
                    label="City"
                    name="city"
                    size="small"
                    margin="dense"
                    value={formData.city}
                    onChange={handleChange}
                  />
                  <FormControl sx={{ m: "10px" }}>
                    <InputLabel id="state-select-label">State</InputLabel>
                    <Select
                      required
                      labelId="state-select-label"
                      id="state-select"
                      value={formData.state}
                      size="small"
                      margin="dense"
                      onChange={(event) => handleSelectChange(event, 'state')}
                      sx={{ width: "10em" }}
                    >
                      <MenuItem value={""}>Please Select</MenuItem>
                      {stateNames.map((state, index) => (
                        <MenuItem key={index} value={state}>{state}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <TextField
                    required
                    label="Zip Code"
                    name="zipCode"
                    size="small"
                    margin="dense"
                    value={formData.zipCode}
                    onChange={handleChange}
                  />
                  <TextField
                    type="file"
                    label="Profile Picture"
                    name="profilePicture"
                    fullWidth
                    size="small"
                    margin="dense"
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ accept: "image/png, image/gif, image/jpeg" }}
                    onChange={handleProfileImageUpload}
                  />
                  <TextField
                    type="file"
                    label="Banner Image"
                    name="bannerImage"
                    fullWidth
                    size="small"
                    margin="dense"
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ accept: "image/png, image/gif, image/jpeg" }}
                    onChange={handleBannerImageUpload}
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
