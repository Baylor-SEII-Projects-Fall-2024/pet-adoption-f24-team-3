import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { Grid, Paper, FormControl, MenuItem, Select, InputLabel, Typography, TextField, Button } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import infoLists from "@/utils/lists";

import dayjs from 'dayjs';
import eventService from "@/utils/services/eventService";


export default function CreateEventPage() {
    const router = useRouter();
    const { createEvent } = eventService();
    const currentUserId = useSelector((state) => state.currentUser.currentUserId);
    const currentUserType = useSelector((state) => state.currentUser.currentUserType);
    const { stateNames } = infoLists();

    const currDate = new Date().toISOString();
    const fieldRegex = RegExp('[^0-9a-zA-Z ]');

    const paperStyle = { padding: '30px 20px', width: 300, margin: "20px auto" }
    const headerStyle = { margin: 0 }

    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [formError, setFormError] = useState(null);

    const [formData, setFormData] = useState({
        datePosted: currDate,
        name: "",
        description: "",
        dateStart: null,
        dateEnd: null,
        address: "",
        city: "",
        state: "",
    });

    React.useEffect(() => {
        if (currentUserType && currentUserType !== "Center") {
            router.push("/events");
        }
    }, [currentUserType]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormError(null);
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleDateChange = (date, fieldName) => {
        if(dayjs(date).isValid){
            return;
        }
        setFormData(prevState => ({
            ...prevState,
            [fieldName]: date ? dayjs(date).toISOString() : null
        }));
    };

    const handleSelectChange = (event, fieldName) => {
        const { value } = event.target;
        setFormData((prevState) => ({ ...prevState, [fieldName]: value }));
    };

    const handleThumbnailUpload = (e) => {
        setThumbnailFile(e.target.files[0]);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if(fieldRegex.test(formData.name)){
            setFormError("Event name has special characters!");
            return;
        }

        try {
            setIsUploading(true);
            await createEvent(formData, thumbnailFile, currentUserId)
                .then(async (result) => {
                    if (result !== null) {
                        setIsUploading(false);
                        router.push(`/events/${result.eventID}`)
                    }
                });

        } catch (error) {
            console.error("Error: ", error);
            setFormError("An error occured during event creation.");
        }
    };


    return (
        <Grid>
            <Paper elevation={10} style={paperStyle} sx={{ minWidth: "50%" }}>
                <Grid align='center'>
                    <Typography variant="h3">New Event</Typography>
                    <Typography variant="h5">Please fill this form to create a new event!</Typography>
                </Grid>
                <form onSubmit={handleSubmit}>
                    <TextField required fullWidth label='Event Name' name="name" size="small" margin="dense" value={formData.name} onChange={handleChange} />
                    <TextField required multiline fullWidth label='Description' name="description" size="small" margin="dense" value={formData.description} onChange={handleChange} />
                    <TextField fullWidth label='Address' name="address" size="small" margin="dense" value={formData.address} onChange={handleChange} />
                    <TextField sx={{ mt: "10px" }} label='City' name="city" size="small" margin="dense" value={formData.city} onChange={handleChange} />
                    <FormControl sx={{ m: "10px" }}>
                        <InputLabel id="state-select-label">State</InputLabel>
                        <Select
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
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <div style={{ marginBottom: '8px', marginTop: '6px' }}>
                            <DateTimePicker
                                required
                                label="Start Date"
                                value={formData.dateStart ? dayjs(formData.dateStart) : null}
                                onChange={(date) => handleDateChange(date, 'dateStart')}
                                TextField={(params) => <TextField {...params} fullWidth margin="normal" />}
                            />
                        </div>
                        <div style={{ marginBottom: '8px' }}>
                            <DateTimePicker
                                required
                                label="End Date"
                                value={formData.dateEnd ? dayjs(formData.dateEnd) : null}
                                onChange={(date) => handleDateChange(date, 'dateEnd')}
                                TextField={(params) => <TextField {...params} fullWidth margin="normal" />}
                            />
                        </div>
                    </LocalizationProvider>
                    <TextField
                        type="file"
                        label='Thumbnail Picture'
                        name="thumbnailPath"
                        size="small" margin="dense"
                        InputLabelProps={{ shrink: true }}
                        inputProps={{ accept: "image/png, image/gif, image/jpeg" }}
                        onChange={handleThumbnailUpload} />
                    <br />
                    {isUploading ?
                        <Typography> Creating Event...</Typography>
                        :
                        <Button type='submit' variant='contained' color='primary'>Post</Button>
                    }
                    <Button variant='contained' onClick={() => router.push("/events")}>Back</Button>
                </form>
                {formError && (
                  <Typography color="error">{formError}</Typography>
                )}
            </Paper>
        </Grid>
    )
}