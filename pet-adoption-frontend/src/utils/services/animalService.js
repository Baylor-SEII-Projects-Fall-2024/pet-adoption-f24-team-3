const apiUrl = process.env.NEXT_PUBLIC_API_URL;


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
        getCenterAnimals,
        getRecommendedAnimals,
    };

};
export default animalService;