import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import {
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
  TextField,
} from "@mui/material";
import { useSelector } from "react-redux";

import userService from "@/utils/services/userService";
import imageService from "@/utils/services/imageService";

export default function EditProfilePage() {
  const router = useRouter();
  const { userId } = router.query; // get user ID from the routing
  const currentUserId = useSelector((state) => state.currentUser.currentUserId); // get the current session user
  const { updateOwner, getUserInfo } = userService();

  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState();
  const [formData, setFormData] = useState({
    accountType: "",
    emailAddress: "",
    password: "",
    nameFirst: "",
    nameLast: "",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState();

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleImageUpload = (e) => {
    setProfileImage(e.target.files[0]);
  };

  //handle what happens on sumbmit. Does not reroute on success.
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateOwner(formData, profileImage, userId).then((result) => {
        //if user id is not null, that is handled in the hook below
        if (result !== null) {
          setFormError(null);
          setFormSuccess("Profile Settings Saved!");
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
      router.push(`/profile/${userId}`);
    }
    if (userId) {
      const fetchUserInfo = async () => {
        try {
          const result = await getOwnerInfo(userId);
          if (result !== null) {
            setUserInfo(result);
            setFormData((prevState) => ({
              ...prevState,
              ["emailAddress"]: result.emailAddress,
            }));
            setFormData((prevState) => ({
              ...prevState,
              ["nameFirst"]: result.nameFirst,
            }));
            setFormData((prevState) => ({
              ...prevState,
              ["nameLast"]: result.nameLast,
            }));
          }
          // Set error state if not ok
        } catch (error) {
          console.error("Error fetching user data:", error);
          setFormError(
            `User information could not be found for user ${userId}`
          );
        } finally {
          setLoading(false);
        }
      };
      fetchUserInfo();
    }
  }, [userId]); // rerender if userId changes

  // create a preview as a side effect, whenever selected file is changed
  useEffect(() => {
    if (!profileImage) {
      setImagePreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(profileImage);
    setImagePreview(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [profileImage]);

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
              <Card sx={{ minWidth: "60vw", p: "15px" }}>
                <form onSubmit={handleSubmit}>
                  <TextField
                    required
                    fullWidth
                    label="Email"
                    name="emailAddress"
                    size="small"
                    margin="dense"
                    value={formData.emailAddress}
                    onChange={handleFormChange}
                  />
                  <TextField
                    fullWidth
                    label="First Name"
                    name="nameFirst"
                    size="small"
                    margin="dense"
                    value={formData.nameFirst}
                    onChange={handleFormChange}
                  />
                  <TextField
                    required
                    fullWidth
                    label="Last Name"
                    name="nameLast"
                    size="small"
                    margin="dense"
                    value={formData.nameLast}
                    onChange={handleFormChange}
                  />
                  <TextField
                    type="file"
                    label="Profile Picture"
                    name="profilePicture"
                    size="small"
                    margin="dense"
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ accept: "image/png, image/gif, image/jpeg" }}
                    onChange={handleImageUpload}
                  />

                  {profileImage && (
                    <img
                      src={imagePreview}
                      style={{ maxWidth: "200px", margin: "10px" }}
                    />
                  )}
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
