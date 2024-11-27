import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import { Button, Grid, Paper, FormControl, Select, InputLabel, MenuItem, Typography, TextField } from '@mui/material'
import { useSelector } from "react-redux";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import eventService from "@/utils/services/eventService";
import infoLists
    from "@/utils/lists";
export default function EditEvent() {
    const router = useRouter();
    const { eventID } = router.query;
    const currentUserId = useSelector((state) => state.currentUser.currentUserId);
    const { stateNames } = infoLists();

    const paperStyle = { padding: '30px 20px', width: 300, margin: "20px auto" }

    const { updateEvent, getEventInfo } = eventService();

    const [loading, setLoading] = useState(true);
    const [eventInfo, setEventInfo] = useState(null);

    const [thumbnailPath, setThumbnailPath] = useState(null);
    const [formData, setFormData] = useState({
        centerId: "",
        datePosted: null,
        name: "",
        description: "",
        dateStart: null,
        dateEnd: null,
        address: "",
        city: "",
        state: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleThumbnailUpload = (e) => {
        setThumbnailPath(e.target.files[0]);
    }

    const handleSelectChange = (event, fieldName) => {
        const { value } = event.target;
        setFormData((prevState) => ({ ...prevState, [fieldName]: value }));
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
            await updateEvent(formData, thumbnailPath, eventID)
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

    if (!loading) {
        return (
            <Grid>
                <Paper elevation={20} style={paperStyle} sx={{ minWidth: "50%" }}>
                    <Grid align='center'>

                        <Typography variant="h3">Edit Event</Typography>
                        <Typography variant="h5">Please modify event info here!</Typography>
                    </Grid>
                    <form onSubmit={handleSubmit}>
                        <TextField fullWidth label='Event Name' name="name" size="small" margin="dense" required value={formData.name} onChange={handleChange} />
                        <TextField fullWidth required label='Address' name="address" size="small" margin="dense" value={formData.address} onChange={handleChange} />
                        <TextField sx={{ mt: "10px" }} label='City' name="city" size="small" margin="dense" required value={formData.city} onChange={handleChange} />
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
                        <TextField multiline fullWidth label='Description' name="description" size="small" margin="dense" value={formData.description} onChange={handleChange} />
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <div style={{ marginBottom: '8px', marginTop: '6px' }}>
                                <DateTimePicker
                                    label="Start Date"
                                    value={formData.dateStart ? dayjs(formData.dateStart) : null}
                                    onChange={(date) => handleDateChange(date, 'dateStart')}
                                    TextField={(params) => <TextField {...params} margin="normal" />}
                                />
                            </div>
                            <div style={{ marginBottom: '8px' }}>
                                <DateTimePicker
                                    label="End Date"
                                    value={formData.dateEnd ? dayjs(formData.dateEnd) : null}
                                    onChange={(date) => handleDateChange(date, 'dateEnd')}
                                    TextField={(params) => <TextField {...params} margin="normal" />}
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
                        <Button type='submit' variant='contained' color='primary'>Save</Button>
                    </form>
                    <label id="errorLabel"></label>

                </Paper>
            </Grid>

        );
    }
}
