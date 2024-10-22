const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const { uploadAnimalPicture } = imageService();

const animalService = () => {

    const getCenterAnimals = async (centerId) => {
        const response = await fetch(`${apiUrl}/api/animals/center/${centerId}`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json"
            },
        });

        const result = await response.json();
        if (response.ok) {
            return result;
        } else {
            alert(`Getting pets failed ${result.message}`);
            return null;
        }
    }

    const getAnimal = async (animalId) => {
        const response = await fetch(`${apiUrl}/api/animals/${animalId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const result = await response.json();
        if (response.ok) {
            return result;
        } else {
            console.error(`Get animal failed: ${result.message}`);
            return null;
        }
    };

    const deleteAnimal = async (animalId) => {
        const response = await fetch(`${apiUrl}/api/animals/${animalId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const result = await response.json();
        if (response.ok) {
            return result;
        } else {
            alert(`Delete Animal failed: ${result.message}`);
            return null;
        }
    };

    const getRecommendedAnimals = async (pageSize, pageNumber) => {
        const response = await fetch(`${apiUrl}/api/animals/recommend?pageSize=${pageSize}&pageNumber=${pageNumber}`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json"
            },
        });

        const result = await response.json();
        if (response.ok) {
            return result;
        } else {
            console.error(`Getting pets failed ${result.message}`);
            return null;
        }
    }
    const updatePet = async (formData, profilePic, petId) => {
        const response = await fetch(`${apiUrl}/api/update/pet/${petId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: formData.name,
                age: formData.age,
                species: formData.species,
                breed: formData.breed,
                sex: formData.sex,
                description: formData.description,
                picPath: formData.picPath,
                size: formData.size,
                ageClass: formData.ageClass,
                height: formData.height,
                weight: formData.weight,
            })
        });

        const result = await response.json();
        if (response.ok) {
            //try to upload banner and profile pic if they exist
            if (profilePic != null) {
                const profilePicResult = await uploadAnimalPicture(profilePic, petId);
                if (!profilePicResult) {
                    return null;
                }
            }
            //return wheter or not both were successful
            return result;
        } else {
            alert(`Update failed: ${formResult.message}`);
            return null;
        }
    };

    return {
        getCenterAnimals,
        getAnimal,
        deleteAnimal,
        getRecommendedAnimals,
        updatePet
    };

};
export default animalService;