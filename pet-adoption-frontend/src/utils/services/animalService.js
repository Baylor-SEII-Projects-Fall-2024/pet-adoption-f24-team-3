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

    return {
        getCenterAnimals,
    };

};
export default animalService;