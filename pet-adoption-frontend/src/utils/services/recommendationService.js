const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const recommendationService = () => {

    const likePet = async (userId, petId) => {
        const response = await fetch(`${apiUrl}/api/recommendations/${userId}/like/${petId}`, {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            }
        });

        const result = await response.json();
        if (response.ok) {
            return result;
        } else {
            console.error(`Like pet failed: ${result.message}`);
            return null;
        }
    };

    const undoLikePet = async (userId, petId) => {
        const response = await fetch(`${apiUrl}/api/recommendations/${userId}/like/${petId}/undo`, {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            }
        });

        const result = await response.json();
        if (response.ok) {
            return result;
        } else {
            console.error(`Undo Like pet failed: ${result.message}`);
            return null;
        }
    };

    const dislikePet = async (userId, petId) => {
        const response = await fetch(`${apiUrl}/api/recommendations/${userId}/dislike/${petId}`, {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            }
        });

        const result = await response.json();
        if (response.ok) {
            return result;
        } else {
            console.error(`Dislike pet failed: ${result.message}`);
            return null;
        }
    };

    const undoDislikePet = async (userId, petId) => {
        const response = await fetch(`${apiUrl}/api/recommendations/${userId}/dislike/${petId}/undo`, {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            }
        });

        const result = await response.json();
        if (response.ok) {
            return result;
        } else {
            console.error(`Undo Dislike pet failed: ${result.message}`);
            return null;
        }
    };


    return {
        likePet,
        undoLikePet,
        dislikePet,
        undoDislikePet,
    };
};
export default recommendationService;