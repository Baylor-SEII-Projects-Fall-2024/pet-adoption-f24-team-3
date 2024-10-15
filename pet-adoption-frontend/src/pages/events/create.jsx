import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { Grid, Paper, Avatar, Typography, TextField, Button } from '@mui/material'
import userService from "@/utils/services/userService";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';



export default function CreateEventPage() {
    const router = useRouter();
    const { createEvent } = userService();
    const currentUserId = useSelector((state) => state.currentUser.currentUserId);
    const currDate = new Date().toISOString();
    const [value, setValue] = React.useState(dayjs(''));

    const paperStyle = { padding: '30px 20px', width: 300, margin: "20px auto" }
    const headerStyle = { margin: 0 }

    const [formData, setFormData] = useState({
        centerId: currentUserId,
        datePosted: currDate,
        name: "",
        description: "",
        dateStart: null,
        dateEnd: null,
        thumbnailPath: "no image",
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
                    case 'thumbnailPath': return 'Thumbnail';
                    default: return field;
                }
            });
            alert(`Please fill in the following fields: ${emptyFieldNames.join(', ')}`);
            return;
        }

        try {
            await createEvent(formData)
                .then((result) => {
                    if (result !== null) {
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
                    <TextField fullWidth label='Description' name="description" size="small" margin="dense" value={formData.description} onChange={handleChange} />
                    {/* <TextField fullWidth label='Start Date' name="address" size="small" margin="dense" value={formData.dateStart} onChange={handleChange} />
                    <TextField fullWidth label='End Date' name="city" size="small" margin="dense" value={formData.dateEnd} onChange={handleChange} /> */}
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
                    <Button type='submit' variant='contained' color='primary'>Post</Button>
                    <Button variant='contained' onClick={() => router.push("/events")}>Back</Button>


                </form>
            </Paper>
        </Grid>
    )
}