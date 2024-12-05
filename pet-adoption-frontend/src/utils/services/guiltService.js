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

  // Gets a users choice on whether to use the grief engine or not
  /*
  const useGriefState = () => {
    const state = useSelector((state) => state);
    const griefState = Cookies.get('griefState') || state.auth?.grief || null;
    console.log(`Grief state: ${griefState ? 'Cookie' : 'Redux'}`);
    return griefState;
  };
  */

  // 我不知道这在做什么
  const useGriefState = () => {
    const griefState = Cookies.get('griefState');
    const reduxGriefState = useSelector((state) => state.auth?.grief);

    if (griefState) {
      console.log(`Grief state from cookie: ${griefState}`);
      return griefState;
    }

    console.log(`Grief state from Redux: ${reduxGriefState}`);
    return reduxGriefState || null;
  };

  const setGriefState = (grief) => {
    Cookies.set('griefState', grief, { expires: 7 });
    dispatch({ type: 'SET_GRIEF_STATE', payload: grief });
  };

  // Fetch user grief details (dislike count, kill count, rank title, etc.)
  const getUserGrief = async (userId) => {
    const authToken = getAuthToken();

    if (!authToken) {
      console.error("No auth token found");
      return null;
    }

    try {
      const response = await fetch(`${apiUrl}/api/grief/${userId}/details`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error("Failed to fetch grief details");
        return null;
      }

      const griefDetails = await response.json();
      return griefDetails;
    } catch (error) {
      console.error("Error fetching grief details:", error);
      return null;
    }
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

    if (!response.ok) {
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

  // Fetch grief leaderboards
  // Possible values for sortby:
  // kills
  // dislikes
  // firstname
  // lastname
  const getLeaderboard = async (sortBy, count) => {
    const authToken = getAuthToken();

    if (!authToken) {
      console.error("No auth token found");
      return null;
    }

    const response = await fetch(`${apiUrl}/api/grief/leaderboard`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sortBy: sortBy,
        count: count,
      })
    });

    if (!response.ok) {
      console.error("Failed to fetch leaderboard");
      return null;
    }

    return response.json();
  };

  return {
    useGriefState,
    setGriefState,
    getUserGrief,
    getDislikeCount,
    incrementDislikeCount,
    decrementDislikeCount,
    getKillCount,
    getEuthanizedPetIds,
    updateEuthanizedPetIds,
    // removeEuthanizedPetIds, -- we do not allow a pet to come back from the grave
    getLeaderboard,
  };
};

export default guiltService;

