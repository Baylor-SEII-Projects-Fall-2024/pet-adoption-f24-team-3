const eventService = () => {

    const getCenterEvents = async (centerId) => {
        const response = await fetch(`http://localhost:8080/api/events/center/${centerId}`, {
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
            alert(`Getting events failed ${result.message}`);
            return null;
        }
    }

    return {
        getCenterEvents,
    };
    
};

export default eventService;