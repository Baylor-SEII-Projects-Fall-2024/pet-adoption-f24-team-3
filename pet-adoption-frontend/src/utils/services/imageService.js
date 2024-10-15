import { useDispatch, useSelector } from 'react-redux';
import { setCurrentUserId } from '@/utils/redux';
import Cookies from 'js-cookie';

const imageService = () => {
    const dispatch = useDispatch();
    const currentUserId = useSelector((state) => state.currentUser.currentUserId);

    // uploads a profile picture. Returns True or error
    const uploadProfilePic = async (imageFile, userId) => {
        const formData = new FormData();
        formData.append("imageFile", imageFile);
        const response = await fetch(`http://localhost:8080/api/images/users/${userId}/profile`, {
            method: "POST",
            headers: {
                //dont need to set for form data    
            },
            body: formData
        });

        const result = await response.json();
        if (response.ok) {
            return result;
        } else {
            alert(`Profile Picture upload failed: ${result.message}`);
            return null;
        }
    };

    // uploads a pet picture
    // TODO: fix
    const uploadPetPic = async (imageFile, animalId) => {
        const formData = new FormData();
        formData.append("imageFile", imageFile);
        const response = await fetch(`http://localhost:8080/api/images/animals/${animalId}/profile`, {
            method: "POST",
            headers: {
                //dont need to set for form data    
            },
            body: formData
        });

        const result = await response.json();
        if (response.ok) {
            return result;
        } else {
            alert(`Profile Picture upload failed: ${result.message}`);
            return null;
        }
    };

    // uploads a center banner picture. Returns True or error
    const uploadCenterBanner = async (imageFile, userId) => {
        const formData = new FormData();
        formData.append("imageFile", imageFile);
        const response = await fetch(`http://localhost:8080/api/images/users/${userId}/banner`, {
            method: "POST",
            headers: {
                //dont need to set for form data    
            },
            body: formData
        });

        const result = await response.json();
        if (response.ok) {
            return result;
        } else {
            alert(`Adoption Center Banner upload failed: ${result.message}`);
            return null;
        }
    };

    // uploads an animal picture. Returns True or error
    const uploadAnimalPicture = async (imageFile, petId) => {
        const formData = new FormData();
        formData.append("imageFile", imageFile);
        const response = await fetch(`http://localhost:8080/api/images/animals/${petId}`, {
            method: "POST",
            headers: {
                //dont need to set for form data    
            },
            body: formData
        });

        const result = await response.json();
        if (response.ok) {
            return result;
        } else {
            alert(`Pet Image upload failed: ${result.message}`);
            return null;
        }
    };

    // uploads an event thumbnail. Returns True or error
    const uploadEventThumbnail = async (imageFile, eventId) => {
        const formData = new FormData();
        formData.append("imageFile", imageFile);
        const response = await fetch(`http://localhost:8080/api/images/events/${eventId}`, {
            method: "POST",
            headers: {
                //dont need to set for form data    
            },
            body: formData
        });

        const result = await response.json();
        if (response.ok) {
            return result;
        } else {
            alert(`Event Thumbnail upload failed: ${result.message}`);
            return null;
        }
    };

    return {
        uploadProfilePic,
        uploadCenterBanner,
        uploadAnimalPicture,
        uploadEventThumbnail,
    };

};
export default imageService;
