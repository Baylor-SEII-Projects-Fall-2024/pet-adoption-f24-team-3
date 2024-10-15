import imageService from './imageService';

const animalService = () => {

  const { uploadPetPic } = imageService();

  const saveAnimal = async (formData, uploadPetPic) => {
  };

  const getAnimal = async (animalId) => {
    const response = await fetch(`http://localhost:8080/api/animals/${animalId}`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json"
      },
    });

    const result = await response.json();
    if(response.ok) {
      return result;
    } else {
      alert(`Getting pet failed ${result.message}`);
      return null;
    }
  };

  const setAnimal = async (formData, petPic) => {
    const response = await fetch(`http://localhost:8080/api/register/animals`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        date: "",
        species: "",
        breed: "",
        sex: "",
        age: "",
        size: "",
        city: "",
        state: "",
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
    const response = await fetch(`http://localhost:8080/api/animals/center/${centerId}`, {
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
    saveAnimal,
    getAnimal,
    getCenterAnimals,
  };

};
export default animalService;
