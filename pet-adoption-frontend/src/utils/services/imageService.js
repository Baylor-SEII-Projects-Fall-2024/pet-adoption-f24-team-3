const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const imageService = () => {

    // uploads a profile picture. Returns True or error
    const uploadProfilePic = async (imageFile, userId) => {
        const formData = new FormData();
        formData.append("imageFile", imageFile);
        const response = await fetch(`${apiUrl}/api/images/users/${userId}/profile`, {
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
        const response = await fetch(`${apiUrl}/api/images/users/${userId}/banner`, {
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
        const response = await fetch(`${apiUrl}/api/images/animals/${petId}`, {
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
        const response = await fetch(`${apiUrl}/api/images/events/${eventId}`, {
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