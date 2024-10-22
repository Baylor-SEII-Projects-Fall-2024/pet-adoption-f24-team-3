import imageService from './imageService';
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const animalService = () => {

    const { uploadProfilePic } = imageService();

    const createPetPost = async (formData, petPic) => {
        console.log(`Saving animal ${formData.petName}`)
        console.log(`formData: ${formData}`)
        const response = await fetch(`${apiUrl}/api/animals`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                date: new Date().toJSON(),
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
                const profilePicResult = await uploadProfilePic(petPic, result.userid);
                if (!profilePicResult) {
                    return null;
                }
            }
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
        createPetPost,
        getAnimal,
        getCenterAnimals,
        getAnimal,
        deleteAnimal,
        getRecommendedAnimals,
    };

};
export default animalService;
