const animalService = () => {

    const getCenterAnimals = async (centerId) => {
        const response = await fetch(`http://localhost:8080/api/animals/center/${centerId}`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json"
            },
        });

        const result = await response.json();
        console.log(result);
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