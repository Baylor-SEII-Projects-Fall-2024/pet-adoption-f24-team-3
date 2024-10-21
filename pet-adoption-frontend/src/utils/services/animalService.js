import imageService from './imageService';
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const animalService = () => {

    const { uploadPetPic } = imageService();

    const saveAnimal = async (formData, uploadPetPic) => {
        const response = await fetch(`http://localhost:8080/api/register/animals`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                date: formData.date,
                petName: formData.petName,
                species: formData.species,
                breed: formData.breed,
                sex: formData.sex,
                age: formData.age,
                size: formData.size,
                city: formData.city,
                state: formData.state,
            })
        });

        const result = await response.json();
        if (response.ok) {
            if (profilePic != null) {
                const imageResult = await uploadPetPic(petPic, result.animalid); // TODO: check actual variable of result
                if (!imageResult) {
                    return null;
                }
            }
            saveCurrentUserToRedux(result.userid);
            setAuthenticationCookies(result.userid);
            return result;
        } else {
            alert(`Registration failed: ${result.message}`);
            return null;
        }
    };

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

    return {
        saveAnimal,
        getAnimal,
        getCenterAnimals,
        getAnimal,
        deleteAnimal,
        getRecommendedAnimals,
    };

};
export default animalService;
