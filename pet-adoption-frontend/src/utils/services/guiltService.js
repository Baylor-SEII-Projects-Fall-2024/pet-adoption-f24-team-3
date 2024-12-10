import { useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import { setGriefEnginePreference } from '@/utils/redux';
import { useDispatch } from 'react-redux';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const guiltService = () => {
  const dispatch = useDispatch();

  // 我不知道这在做什么

  // Save grief engine preference to Redux
  const saveGriefToRedux = async (preference) => {
    setGriefEnginePreference(preference);
  };

  // Save grief preference to cookie
  const saveGriefToCookie = async (preference) => {
    Cookies.set('griefEnginePreference', preference, { expires: 7 });
  };

  // Get grief engine preference from Cookies and save to Redux
  const setGriefPreference = () => {
    const preference = Cookies.get('griefEnginePreference');
    const prefbool = preference === 'true';

    // Default to true if not found
    if (preference !== undefined) {
      dispatch(setGriefEnginePreference(prefbool));
    } else {
      const defaultPreference = true;
      dispatch(setGriefEnginePreference(defaultPreference));
      saveGriefToCookie(defaultPreference);
    }
  };

  // Clear grief engine preference from Redux and Cookies
  const clearGriefEnginePreference = () => {
    // Remove from Redux
    dispatch(setGriefEnginePreference(false));

    // Remove from Cookies
    Cookies.remove('griefEnginePreference');
  };

  const logErrorResponse = async (response) => {
    try {
      const errorMessage = await response.text();
      switch (response.status) {
        case 400:
          console.error(`Bad Request: ${errorMessage}`);
          break;
        case 401:
          console.error(`Unauthorized: ${errorMessage}. Please log in.`);
          break;
        case 403:
          console.error(`Forbidden: ${errorMessage}. Access is denied.`);
          break;
        case 404:
          console.error(`Not Found: ${errorMessage}. The resource might not exist.`);
          break;
        case 500:
          console.error(`Internal Server Error: ${errorMessage}. Something went wrong on the server.`);
          break;
        case 503:
          console.error(`Service Unavailable: ${errorMessage}. Try again later.`);
          break;
        default:
          console.error(`Unexpected Error (${response.status}): ${errorMessage}`);
          break;
      }
    } catch (error) {
      console.error("Error while parsing the response:", error);
    }
  };

  // Fetch user grief details (dislike count, kill count, rank title, etc.)
  const getUserGrief = async (userId) => {
    try {
      const response = await fetch(`${apiUrl}/api/grief/${userId}/details`, {
        method: 'GET',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error("Failed to fetch grief details");
        logErrorResponse(response);
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
    try {
      const response = await fetch(`${apiUrl}/api/grief/${userId}/dislikes`, {
        method: 'GET',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error("Failed to fetch dislike count");
        logErrorResponse(response);
        return null;
      }

      return await response.text();
    } catch (error) {
      console.error("Error fetching dislike count");
      return null;
    }
  };

  // Increment dislike count
  const incrementDislikeCount = async (userId) => {
    try {
      const response = await fetch(`${apiUrl}/api/grief/${userId}/dislike`, {
        method: 'POST',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error("Failed to increment dislike count");
        logErrorResponse(response);
        return null;
      }

      return response.ok;
    } catch (error) {
      console.error("Error incrementing dislike count");
      return null;
    }
  };

  // Decrement dislike count
  const decrementDislikeCount = async (userId) => {
    try {
      const response = await fetch(`${apiUrl}/api/grief/${userId}/undislike`, {
        method: 'POST',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error("Failed to decrement dislike count");
        logErrorResponse(response);
        return null;
      }

      return response.ok;
    } catch (error) {
      console.error("Error decrementing dislike count");
      return null;
    }
  };

  // Get a users kill count
  const getKillCount = async (userId) => {
    try {
      const response = await fetch(`${apiUrl}/api/grief/${userId}/killcount`, {
        method: 'GET',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error("Failed to get kill count");
        logErrorResponse(response);
        return null;
      }

      return await response.text();
    } catch (error) {
      console.error("Error when fetching kill count");
      return null;
    }
  };

  // Fetch euthanized pet IDs
  const getEuthanizedPetIds = async (userId) => {
    try {
      const response = await fetch(`${apiUrl}/api/grief/${userId}/euthanizedPets`, {
        method: 'GET',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error("Failed to fetch euthanized pet IDs");
        logErrorResponse(response);
        return null;
      }

      return await response.text();
    } catch (error) {
      console.error("Error when getting euthanized pet ids");
      return null;
    }
  };

  // Update euthanized pet IDs
  const updateEuthanizedPetIds = async (userId, petId) => {
    try {
      const response = await fetch(`${apiUrl}/api/grief/${userId}/euthanizePet?petId=${petId}`, {
        method: 'POST',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error("Failed to update euthanized pet IDs");
        logErrorResponse(response);
        return null;
      }

      return response.ok;
    } catch (error) {
      console.error("Error when updating euthanized pet ids");
      return null;
    }
  };

  // Fetch grief leaderboards
  // Possible values for sortby:
  // kills
  // dislikes
  const getLeaderboard = async (sortBy, count) => {
    try {
      const response = await fetch(`${apiUrl}/api/grief/leaderboard?sortBy=${sortBy}&count=${count}`, {
        method: 'GET',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error("Failed to fetch leaderboard");
        logErrorResponse(response);
        return null;
      }

      return response.json();
    } catch (error) {
      console.error("Error fetching leaderboard");
      return null;
    }
  };

  return {
    saveGriefToRedux,
    saveGriefToCookie,
    setGriefPreference,
    clearGriefEnginePreference,
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

