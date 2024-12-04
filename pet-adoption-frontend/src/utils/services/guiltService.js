import { useSelector } from 'react-redux';
import Cookies from 'js-cookie';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const guiltService = () => {
  // Sometimes slow
  // const currentUserId = useSelector((state) => state.currentUser.currentUserId);

  // Helper function to get current auth token
  const getAuthToken = () => {
    // Retrieve token from cookies
    let token = Cookies.get('authenticationToken');

    // Fallback to Redux if token not found in cookies
    if (!token) {
      const state = useSelector((state) => state);
      return state.auth?.token || null;
    }

    return token;
  };

  // Fetch dislike count
  const getDislikeCount = async (userId) => {
    const authToken = getAuthToken();

    if (!authToken) {
      console.error("No auth token found");
      return;
    }

    const response = await fetch(`${apiUrl}/api/grief/${userId}/dislikes`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`
      },
    });

    if(!response.ok) {
      console.error("Failed to get dislike count");
      return null;
    }

    return await response.text();
  };

  // Increment dislike count
  const incrementDislikeCount = async (userId) => {
    const authToken = getAuthToken();

    if (!authToken) {
      console.error("No auth token found");
      return null;
    }

    const response = await fetch(`${apiUrl}/api/grief/${userId}/dislike`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error("Failed to increment dislike count");
      return null;
    }

    return true;
  };

  // Decrement dislike count
  const decrementDislikeCount = async (userId) => {
    const authToken = getAuthToken();

    if (!authToken) {
      console.error("No auth token found");
      return null;
    }

    const response = await fetch(`${apiUrl}/api/grief/${userId}/undislike`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error("Failed to decrement dislike count");
      return null;
    }

    return true;
  };

  // Get a users kill count
  const getKillCount = async (userId) => {
    const authToken = getAuthToken();

    if (!authToken) {
      console.error("No auth token found");
      return null;
    }

    const response = await fetch(`${apiUrl}/api/grief/${userId}/killcount`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error("Failed to increment kill count");
      return null;
    }

    return response.text();
  };

  // Fetch euthanized pet IDs
  const getEuthanizedPetIds = async (userId) => {
    const authToken = getAuthToken();

    if (!authToken) {
      console.error("No auth token found");
      return null;
    }

    const response = await fetch(`${apiUrl}/api/grief/${userId}/euthanizedPets`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error("Failed to fetch euthanized pet IDs");
      return null;
    }

    return await response.text();
  };

  // Update euthanized pet IDs
  const updateEuthanizedPetIds = async (userId, petId) => {
    const authToken = getAuthToken();

    if (!authToken) {
      console.error("No auth token found");
      return null;
    }

    const response = await fetch(`${apiUrl}/api/grief/${userId}/euthanizePet?petId=${petId}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error("Failed to update euthanized pet IDs");
      return null;
    }

    return true;
  };

  const getDislikeTitleAndMessage = (dislikeCount) => {
    if (dislikeCount < 10) {
      return {
        title: "Burgeoning Sociopath",
        message: "So you feel good about yourself?",
      };
    } else if (dislikeCount < 20) {
      return {
        title: "Adept Sociopath",
        message: "Look at how many you've sentenced to death.",
      };
    } else if (dislikeCount < 30) {
      return {
        title: "Master Sociopath",
        message: "Do you even care about their lives?",
      };
    } else {
      return {
        title: "Supreme Sociopath",
        message: "Congratulations! You've made quite an impact!",
      };
    }
  };

  return {
    getDislikeCount,
    incrementDislikeCount,
    decrementDislikeCount,
    getKillCount,
    getEuthanizedPetIds,
    updateEuthanizedPetIds,
    // removeEuthanizedPetIds, -- we do not allow a pet to come back from the grave
    getDislikeTitleAndMessage,
  };
};

export default guiltService;

