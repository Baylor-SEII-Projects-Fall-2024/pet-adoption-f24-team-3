const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const recommendationService = () => {
    const likePet = async (userId, petId) => {
        const response = await fetch(`${apiUrl}/api/recommendations/${userId}/like/${petId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const result = await response.json();
        if (response.ok) {
            console.log(result);
            return result;
        } else {
            alert(`Like pet failed: ${result.message}`);
            return null;
        }
    };

    return{
        likePet
    };
};
export default recommendationService;