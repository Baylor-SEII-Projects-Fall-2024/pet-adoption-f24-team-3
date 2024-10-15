import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import { Button, Grid, Paper, Card, CardContent, Stack, Typography, TextField } from '@mui/material'
import { useSelector } from "react-redux";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import eventService from "@/utils/services/eventService";

export default function EditEvent() {
    const router = useRouter(); 
    const { eventID } = router.query;
    const currentUserId = useSelector((state) => state.currentUser.currentUserId);

    const paperStyle = { padding: '30px 20px', width: 300, margin: "20px auto" }
    const headerStyle = { margin: 0 }

    const { updateEvent, getEventInfo } = eventService();

    const [loading, setLoading] = useState(true);
    const [eventInfo, setEventInfo] = useState(null);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        centerId: "",
        datePosted: null,
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

        try {
            await updateEvent(formData, eventID)
                .then((eventID) => {
                    if (eventID !== null) {
                        let elm = document.getElementById("errorLabel");
                        elm.innerHTML = "Event Details Saved!";
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
        if (eventID) {
            const fetchEventInfo = async () => {
                try {
                    const result = await getEventInfo(eventID);
                    if (result) {
                        setEventInfo(result);
                        setFormData(prevState => ({
                            ...prevState,
                            centerId: result.centerId,
                            name: result.name,
                            datePosted: result.datePosted,
                            description: result.description,
                            dateStart: result.dateStart,
                            dateEnd: result.dateEnd
                        }));
                    }
                } catch (error) {
                    setError(`Event information could not be found for event ${eventID}`);
                } finally {
                    setLoading(false);
                }
            };
            fetchEventInfo();
        }
    }, [eventID]);
    
    if(!loading){
    return (
        <Grid>
        <Paper elevation={20} style={paperStyle}>
            <Grid align='center'>

                <h2 style={headerStyle}>Edit Event</h2>
                <Typography variant="caption">Please modify event info here!</Typography>
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
                    <Button type='submit' variant='contained' color='primary'>Save</Button>
                </form>
                <label id="errorLabel"></label>

               </Paper>
               </Grid>
        
    );
    } 
    }
