import { useDispatch, useSelector } from 'react-redux';
import { setCurrentUserId } from '@/utils/redux';
import Cookies from 'js-cookie';

const eventService = () => {
    const dispatch = useDispatch();
    const currentUserId = useSelector((state) => state.currentUser.currentUserId);

    const createEvent = async (formData) => {
        const response = await fetch("http://localhost:8080/api/events", {
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
        const response = await fetch(`http://localhost:8080/api/events/${eventID}`, {
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

    const updateEvent = async (formData, eventID) => {
        const response = await fetch(`http://localhost:8080/api/events/update/${eventID}`, {
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
                thumbnailPath: formData.thumbNail
            })
        });

        const result = await response.json();
        console.log("result:", result);
        if (response.ok) {
            //saveCurrentUserToRedux(result.eventID);
            return result;
        } else {
            alert(`Update failed: ${result.message}`);
            return null;
        }
    };

    const getCenterEvents = async (centerId) => {
        const response = await fetch(`http://localhost:8080/api/events/center/${centerId}`, {
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
        getCenterEvents,
    };

};

export default eventService;