import { useSelector } from 'react-redux';
import Cookies from 'js-cookie';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const guiltService = () => {
  const currentUserId = useSelector((state) => state.currentUser.currentUserId);

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
  const getDislikeCount = async () => {
    const authToken = getAuthToken();

    if (!authToken) {
      console.error("No auth token found");
      return;
    }

    const response = await fetch(`${apiUrl}/api/grief/${currentUserId}/dislikes`, {
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
  const incrementDislikeCount = async () => {
    const authToken = getAuthToken();

    if (!authToken) {
      console.error("No auth token found");
      return null;
    }

    const response = await fetch(`${apiUrl}/api/grief/${currentUserId}/dislike`, {
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
  const decrementDislikeCount = async () => {
    const authToken = getAuthToken();

    if (!authToken) {
      console.error("No auth token found");
      return null;
    }

    const response = await fetch(`${apiUrl}/api/grief/${currentUserId}/undislike`, {
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

  // Fetch euthanized pet IDs
  const getEuthanizedPetIds = async () => {
    const authToken = getAuthToken();

    if (!authToken) {
      console.error("No auth token found");
      return null;
    }

    const response = await fetch(`${apiUrl}/api/grief/${currentUserId}/euthanizedPets`, {
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
  const updateEuthanizedPetIds = async (petId) => {
    const authToken = getAuthToken();

    if (!authToken) {
      console.error("No auth token found");
      return null;
    }

    const response = await fetch(`${apiUrl}/api/grief/${currentUserId}/euthanizePet?petId=${petId}`, {
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

  // Remove euthanized pet IDs
  const removeEuthanizedPetIds = async (petId) => {
    const authToken = getAuthToken();

    if (!authToken) {
      console.error("No auth token found");
      return null;
    }

    const response = await fetch(`${apiUrl}/api/grief/${currentUserId}/unEuthanizePet?petId=${petId}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error("Failed to remove euthanized pet IDs");
      return null;
    }

    return true;
  };

  return {
    getDislikeCount,
    incrementDislikeCount,
    decrementDislikeCount,
    getEuthanizedPetIds,
    updateEuthanizedPetIds,
    removeEuthanizedPetIds,
  };
};

export default guiltService;

