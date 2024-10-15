import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { Grid, Paper, Avatar, Typography, TextField, Button } from '@mui/material'
import userService from "@/utils/services/userService";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import eventService from "@/utils/services/eventService";
import imageService from "@/utils/services/imageService";


export default function CreateEventPage() {
    const router = useRouter();
    const { createEvent } = eventService();
    const { uploadEventThumbnail } = imageService();
    const currentUserId = useSelector((state) => state.currentUser.currentUserId);
    const currDate = new Date().toISOString();

    const paperStyle = { padding: '30px 20px', width: 300, margin: "20px auto" }
    const headerStyle = { margin: 0 }

    const [thumbnailPath, setThumbnailPath] = useState(null);
    const [isUploading, setIsUploading] = useState(false);


    const [formData, setFormData] = useState({
        centerId: currentUserId,
        datePosted: currDate,
        name: "",
        description: "",
        dateStart: null,
        dateEnd: null,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleDateChange = (date, fieldName) => {
        setFormData(prevState => ({
            ...prevState,
            [fieldName]: date ? dayjs(date).toISOString() : null
        }));
    };

    const handleThumbnailUpload = (e) => {
        setThumbnailPath(e.target.files[0]);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const emptyFields = Object.keys(formData).filter(key => !formData[key]);

        if (emptyFields.length > 0) {
            const emptyFieldNames = emptyFields.map(field => {
                switch (field) {
                    case 'name': return 'Name';
                    case 'description': return 'Description';
                    case 'dateStart': return 'Start Date';
                    case 'dateEnd': return 'End Date';
                    default: return field;
                }
            });
            alert(`Please fill in the following fields: ${emptyFieldNames.join(', ')}`);
            return;
        }

        try {
            setIsUploading(true);
            await createEvent(formData)
                .then(async (result) => {
                    if (result !== null) {
                        if (thumbnailPath != null){
                            await uploadEventThumbnail(thumbnailPath, result.eventID);
                        }
                        setIsUploading(false);
                        console.log(isUploading);
                        alert("Event Created")
                        router.push("/events")
                    }
                });

        } catch (error) {
            console.error("Error: ", error);
            alert("An error occured during event creation.");
        }
    };


    return (
        <Grid>
            <Paper elevation={20} style={paperStyle}>
                <Grid align='center'>

                    <h2 style={headerStyle}>New Event</h2>
                    <Typography variant="caption">Please fill this form to create a new event!</Typography>
                </Grid>
                <form onSubmit={handleSubmit}>
                    <TextField fullWidth label='Event Name' name="name" size="small" margin="dense" value={formData.name} onChange={handleChange} />
                    <TextField multiline fullWidth label='Description' name="description" size="small" margin="dense" value={formData.description} onChange={handleChange} />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <div style={{ marginBottom: '8px', marginTop: '6px'}}>
                            <DatePicker
                                label="Start Date"
                                value={formData.dateStart ? dayjs(formData.dateStart) : null}
                                onChange={(date) => handleDateChange(date, 'dateStart')}
                                TextField={(params) => <TextField {...params} fullWidth margin="normal" />}
                            />
                        </div>
                        <div style={{ marginBottom: '8px' }}>
                            <DatePicker
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
                    
                    {isUploading ?
                        <Typography> Creating Event...</Typography>
                        :
                        <Button type='submit' variant='contained' color='primary'>Post</Button>

                    }
                    <Button variant='contained' onClick={() => router.push("/events")}>Back</Button>


                </form>
            </Paper>
        </Grid>
    )
}