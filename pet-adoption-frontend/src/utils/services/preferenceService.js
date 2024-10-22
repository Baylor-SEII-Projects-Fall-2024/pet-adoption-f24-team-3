const preferenceService = () => {

    const getPreferences = async (userId) => {
        const response = await fetch(`http://localhost:8080/api/preferences/${userId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
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
        const response = await fetch(`http://localhost:8080/api/update/preferences/${userid}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
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
