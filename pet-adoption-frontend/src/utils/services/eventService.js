const apiUrl = process.env.NEXT_PUBLIC_API_URL;
import imageService from './imageService';

const eventService = () => {
    const { uploadEventThumbnail } = imageService();

    const createEvent = async (formData, thumbnailImage, centerId) => {
        console.log("Creating new event:", formData, centerId, thumbnailImage);
        const response = await fetch(`${apiUrl}/api/events/`, {
            method: "POST",
            credentials: "include",
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
                address: formData.address,
                city: formData.city,
                state: formData.state,
            })
        });

        const result = await response.json();
        if (response.ok) {
            if (thumbnailImage != null) {
                const thumbnailResult = uploadEventThumbnail(thumbnailImage, result.eventID);
                if (thumbnailResult == null) {
                    console.log("Error uploading event thumbnail!");
                    return null;
                }
            }
            return result;
        } else {
            alert(`Event creation failed: ${result.message}`);
            return null;
        }
    };

    const getEventInfo = async (eventID) => {
        const response = await fetch(`${apiUrl}/api/events/${eventID}`, {
            method: "GET",
            credentials: "include",
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
            credentials: "include",
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
                address: formData.address,
                city: formData.city,
                state: formData.state,
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
            credentials: "include",
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
            credentials: "include",
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

    const getEventsByPage = async (pageSize, pageNumber) => {
        const response = await fetch(`${apiUrl}/api/events/paginated?pageSize=${pageSize}&pageNumber=${pageNumber}`, {
            method: 'GET',
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
        });

        const result = await response.json();
        if (response.ok) {
            return result;
        } else {
            console.error(`Getting events failed ${result.message}`);
            return null;
        }
    }

    const getEventsByPageSort = async (pageSize, pageNumber, stateSort, citySort) => {
        let url = `${apiUrl}/api/events/paginated/sort?pageSize=${pageSize}&pageNumber=${pageNumber}`;
    
        if (stateSort) {
            url += `&state=${encodeURIComponent(stateSort)}`;
        }
        if (citySort) {
            url += `&city=${encodeURIComponent(citySort)}`;
        }
    
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json"
            },
        });
    
        const result = await response.json();
        console.log(url); // Log the URL being sent to the API
        console.log(result); // Log the result returned by the API

        if (response.ok) {
            return result;
        } else {
            console.error(`Getting events failed: ${result.message}`);
            return null;
        }
    }
    


    return {
        createEvent,
        getEventInfo,
        updateEvent,
        deleteEvent,
        getCenterEvents,
        getEventsByPage,
        getEventsByPageSort,
    };

};

export default eventService;