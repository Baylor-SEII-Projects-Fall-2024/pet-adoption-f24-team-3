const apiUrl = process.env.NEXT_PUBLIC_API_URL;
import imageService from './imageService';

const eventService = () => {
    const { uploadEventThumbnail } = imageService();

    const createEvent = async (formData, centerId) => {
        const response = await fetch(`${apiUrl}/api/events`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                centerId: centerId,
                datePosted: formData.datePosted,
                name: formData.name,
                description: formData.description,
                dateStart: formData.dateStart,
                dateEnd: formData.dateEnd,
                thumbnailPath: formData.thumbNail
            })
        });

        const result = await response.json();
        if (response.ok) {
            // saveCurrentUserToRedux(result.userid); Don't think these are needed
            // setAuthenticationCookies(result.userid);
            return result;
        } else {
            alert(`Event creation failed: ${result.message}`);
            return null;
        }
    };

    const getEventInfo = async (eventID) => {
        const response = await fetch(`${apiUrl}/api/events/${eventID}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const result = await response.json();
        console.log(result);
        if (response.ok) {
            return result;
        } else {
            alert(`Get info failed: ${result.message}`);
            return null;
        }
    };


    const updateEvent = async (formData, thumbnail, eventID) => {
        const response = await fetch(`${apiUrl}/api/events/update/${eventID}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                centerId: formData.centerId,
                datePosted: formData.datePosted,
                name: formData.name,
                description: formData.description,
                dateStart: formData.dateStart,
                dateEnd: formData.dateEnd,
            })
        });

        const result = await response.json();
        if (response.ok) {
            if (thumbnail != null) {
                const thumbnailResult = await uploadEventThumbnail(thumbnail, eventID);
                if (thumbnailResult == null) {
                    return null;
                }
            }
            return result;
        } else {
            alert(`Update failed: ${result.message}`);
            return null;
        }
    };

    const deleteEvent = async (eventID) => {
        const response = await fetch(`${apiUrl}/api/events/${eventID}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const result = await response.json();
        if (response.ok) {
            return result;
        } else {
            alert(`Delete Event failed: ${result.message}`);
            return null;
        }
    };

    const getCenterEvents = async (centerId) => {
        const response = await fetch(`${apiUrl}/api/events/center/${centerId}`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json"
            },
        });
        const result = await response.json();
        if (response.ok) {
            return result;
        } else {
            alert(`Getting events failed ${result.message}`);
            return null;
        }
    };


    return {
        createEvent,
        getEventInfo,
        updateEvent,
        deleteEvent,
        getCenterEvents,
    };

};

export default eventService;