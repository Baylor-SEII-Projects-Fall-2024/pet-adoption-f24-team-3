import { useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import { setGriefEnginePreference } from '@/utils/redux';
import { useDispatch } from 'react-redux';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const guiltService = () => {
  const dispatch = useDispatch();

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
    const response = await fetch(`${apiUrl}/api/grief/${userId}/dislikes`, {
      method: 'GET',
      credentials: "include",
      headers: {
        'Content-Type': 'application/json',
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
    const response = await fetch(`${apiUrl}/api/grief/${userId}/dislike`, {
      method: 'POST',
      credentials: "include",
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error("Failed to increment dislike count");
      return null;
    }

    return response.ok;
  };

  // Decrement dislike count
  const decrementDislikeCount = async (userId) => {
    const response = await fetch(`${apiUrl}/api/grief/${userId}/undislike`, {
      method: 'POST',
      credentials: "include",
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error("Failed to decrement dislike count");
      return null;
    }

    return response.ok;
  };

  // Get a users kill count
  const getKillCount = async (userId) => {
    const response = await fetch(`${apiUrl}/api/grief/${userId}/killcount`, {
      method: 'GET',
      credentials: "include",
      headers: {
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
    const response = await fetch(`${apiUrl}/api/grief/${userId}/euthanizedPets`, {
      method: 'GET',
      credentials: "include",
      headers: {
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
    const response = await fetch(`${apiUrl}/api/grief/${userId}/euthanizePet?petId=${petId}`, {
      method: 'POST',
      credentials: "include",
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error("Failed to update euthanized pet IDs");
      return null;
    }

    return response.ok;
  };

  // Fetch grief leaderboards
  // Possible values for sortby:
  // kills
  // dislikes
  const getLeaderboard = async (sortBy, count) => {
    const response = await fetch(`${apiUrl}/api/grief/leaderboard?sortBy=${sortBy}&count=${count}`, {
      method: 'GET',
      credentials: "include",
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error("Failed to fetch leaderboard");
      return null;
    }

    return response.json();
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

