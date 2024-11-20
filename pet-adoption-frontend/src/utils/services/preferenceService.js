import { useSelector } from "react-redux";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const preferenceService = () => {
    const authenticationToken = useSelector((state) => state.authenticationToken.token);

    const getPreferences = async (userId) => {
        const response = await fetch(`${apiUrl}/api/preferences/${userId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authenticationToken}`,
            }
        });

        const result = await response.json();
        if (response.ok) {
            console.log(result);
            return result;
        } else {
            alert(`Get preferences failed: ${result.message}`);
            return null;
        }
    };

    const updatePreferences = async (formData, userid) => {
        const response = await fetch(`${apiUrl}/api/update/preferences/${userid}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authenticationToken}`,
            },
            body: JSON.stringify({
                userId: userid,
                species: formData.species,
                breed: formData.breed,
                sex: formData.sex,
                ageClass: formData.age,
                size: formData.size,
                city: formData.city,
                state: formData.state
            })
        });

        const result = await response.json();
        if (response.ok) {
            return result;
        } else {
            alert(`Update failed: ${result.message}`);
            return null;
        }
    };

    return {
        getPreferences,
        updatePreferences,
    };

};

export default preferenceService;
