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
} from "@mui/material";
import { useSelector } from "react-redux";
import { UploadFile } from "@mui/icons-material";
import { toFormData } from "axios";

export default function EditProfilePage() {
  const router = useRouter();
  const { userId } = router.query; // get user ID from the routing
  const currentUserId = useSelector((state) => state.currentUser.currentUserId); // get the current session user
  const { updateOwner, getOwnerInfo } = userService();

  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    accountType: "Owner",
    emailAddress: "",
    password: "",
    profilePicPath: null,
    nameFirst: "",
    nameLast: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };
  //handle what happens on sumbmit. Does not reroute on success.
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateOwner(formData, userId).then((userId) => {
        //if user id is not null, that is handled in the hook below
        if (userId !== null) {
          let elm = document.getElementById("errorLabel");
          elm.innerHTML = "Profile Settings Saved!";
          elm.style = "color: green;";
        } else {
          let elm = document.getElementById("errorLabel");
          elm.innerHTML = "An error occured, try again!";
          elm.style = "color: red;";
        }
      });
    } catch (error) {
      console.error("Error: ", error);
      alert("An error occured saving data.");
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
          setError(`User information could not be found for user ${userId}`);
        } finally {
          setLoading(false);
        }
      };
      fetchUserInfo();
    }
  }, [userId]); // rerender if userId changes
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
                    onChange={handleChange}
                  />
                  <TextField
                    fullWidth
                    label="First Name"
                    name="nameFirst"
                    size="small"
                    margin="dense"
                    value={formData.nameFirst}
                    onChange={handleChange}
                  />
                  <TextField
                    required
                    fullWidth
                    label="Last Name"
                    name="nameLast"
                    size="small"
                    margin="dense"
                    value={formData.nameLast}
                    onChange={handleChange}
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
}
