import React, { useEffect, useState } from "react";
import Head from 'next/head';
import { useRouter } from 'next/router';
import userService from "@/utils/services/userService";
import { Button, Card, CardContent, Stack, Typography, TextField } from '@mui/material'
import { useSelector } from "react-redux";
import { UploadFile } from '@mui/icons-material';
import { toFormData } from "axios";

export default function EditProfilePage() {
  const router = useRouter();
  const { centerId } = router.query; // get user ID from the routing
  const currentUserId = useSelector((state) => state.currentUser.currentUserId); // get the current session user
  const { updateCenter, getCenterInfo } = userService();

  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    accountType: "",
    emailAddress: "",
    password: "",
    profilePicPath: null,
    name: "",
    address: "",
    city: "",
    state: "",
    zipCode: ""
  });
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };
  //handle what happens on sumbmit. Does not reroute on success.
  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
      await updateCenter(formData,centerId)
          .then((centerId) => {
              //if user id is not null, that is handled in the hook below
              if (centerId !== null) {
                let elm = document.getElementById("errorLabel");
                elm.innerHTML = "Profile Settings Saved!";
                elm.style = "color: green;"
              }
              else {
                let elm = document.getElementById("errorLabel");
                elm.innerHTML = "An error occured, try again!";
                elm.style = "color: red;"
              }
          })


  } catch (error) {
      console.error("Error: ", error);
      alert("An error occured saving data.");
  }
};
  useEffect(() => {
    if(centerId && centerId != currentUserId){
      router.push(`/centers/${centerId}`);
    }
    if (centerId) {
      const fetchUserInfo = async () => {
        try {
          const result = await getCenterInfo(centerId);
          if (result !== null) {
            setUserInfo(result);

            setFormData(prevState => ({ ...prevState, ["accountType"]: result.accountType }));
            setFormData(prevState => ({ ...prevState, ["emailAddress"]: result.emailAddress }));
            setFormData(prevState => ({ ...prevState, ["name"]: result.name }));
            setFormData(prevState => ({ ...prevState, ["address"]: result.address }));
            setFormData(prevState => ({ ...prevState, ["city"]: result.city }));
            setFormData(prevState => ({ ...prevState, ["state"]: result.state }));
            setFormData(prevState => ({ ...prevState, ["zipCode"]: result.zipCode }));
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
if(!loading){
return(
    <>
      <Head>
        <title>Edit Profile Page</title>
      </Head>

      <main>
        <Stack sx={{ paddingTop: 4 }} alignItems='center' gap={2}>
          <Card sx={{ width: 600 }} elevation={4}>
            <CardContent> 
              <Typography variant='h3' align='center'>Profile Settings</Typography>
            </CardContent>
          </Card>
          <Stack direction="column" >
            <Card sx={{ minWidth:"60vw", p:"15px" }} >
            <form id="Form" onSubmit={handleSubmit}>
              <TextField required fullWidth label='Email' name="emailAddress" size="small" margin="dense" value={formData.emailAddress} onChange={handleChange} />
              <TextField required fullWidth label='Name' name="name" size="small" margin="dense" value={formData.name} onChange={handleChange} />
              <TextField required fullWidth label='Address' name="address" size="small" margin="dense" value={formData.address} onChange={handleChange} />
              <TextField required fullWidth label='City' name="city" size="small" margin="dense" value={formData.city} onChange={handleChange} />
              <TextField required fullWidth label='State' name="state" size="small" margin="dense" value={formData.state} onChange={handleChange} />
              <TextField required fullWidth label='Zip Code' name="zipCode" size="small" margin="dense" value={formData.zipCode} onChange={handleChange} />
                
              <Button type='submit' variant='contained' color='primary'>Save</Button>
              
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
