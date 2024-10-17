import { useDispatch, useSelector } from 'react-redux';
import { setCurrentUserId } from '@/utils/redux';
import Cookies from 'js-cookie';
import imageService from './imageService';
//import { headers } from 'next/headers';

const userService = () => {
    const dispatch = useDispatch();
    const currentUserId = useSelector((state) => state.currentUser.currentUserId);
    const { uploadProfilePic, uploadCenterBanner } = imageService();

    //  validates the user login.Returns the user ID if successful, null otherwise
    const validateLogin = async (email, password) => {
        const response = await fetch("http://localhost:8080/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                emailAddress: email,
                password: password,
            })
        });
        const result = await response.json();

        if (response.ok) {
            saveCurrentUserToRedux(result.userid);
            setAuthenticationCookies(result.userid);

            return result.userid;
        } else {
            return null;
        }
    };


    // registers and logs in a new center
    const registerCenter = async (formData, profilePic, bannerPic) => {
        const response = await fetch("http://localhost:8080/api/centers", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                accountType: "Center",
                emailAddress: formData.email,
                password: formData.password,
                name: formData.centerName,
                address: formData.address,
                city: formData.city,
                state: formData.state,
                zipCode: formData.zip,
                description: "A safe haven for homeless pets",
            })
        });

        const result = await response.json();
        if (response.ok) {
            if (profilePic != null) {
                const profilePicResult = await uploadProfilePic(profilePic, result.userid);
                if (!profilePicResult) {
                    return null;
                }
            }
            if (bannerPic != null) {
                const bannerPicResult = await uploadCenterBanner(bannerPic, result.userid);
                if (!bannerPicResult) {
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

    const registerOwner = async (formData, profilePic) => {
        const response = await fetch("http://localhost:8080/api/owners", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                accountType: "Owner",
                emailAddress: formData.email,
                password: formData.password,
                nameFirst: formData.firstName,
                nameLast: formData.lastName
            })
        });

        const result = await response.json();
        if (response.ok) {
            if (profilePic != null) {
                const imageResult = await uploadProfilePic(profilePic, result.userid);
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

    //fetch a few pieces of user data to retain across the session for ease of access
    //also sets the user id in redux, which is needded to access restricted pages
    const saveCurrentUserToRedux = async (userid) => {
        dispatch(setCurrentUserId(userid));
        const getSessionUserData = await fetch(`http://localhost:8080/api/users/${userid}/sessionData`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const result = await getSessionUserData.json();
        if (getSessionUserData.ok) {
            dispatch({ type: 'SET_CURRENT_USER_FULL_NAME', payload: result.userFullName });
            dispatch({ type: 'SET_CURRENT_USER_TYPE', payload: result.accountType });
        } else {
            console.error("Error: Unable to fetch session data for user!")
        }

    };

    const setAuthenticationCookies = async (userid) => {
        // TODO: Add API request to generate authentication token
        Cookies.set('userId', userid, { expires: 100 });
        Cookies.set('authenticationToken', 1, { expires: 100 });
    }

    // validates the user using user id and authentication token stored in cookie
    const authenticateFromCookie = async () => {
        const userIdCookie = Cookies.get('userId');
        const authTokenCookie = Cookies.get('authenticationToken');

        //TODO: Add API request to verify Auth Token
        if (userIdCookie && authTokenCookie) {
            saveCurrentUserToRedux(userIdCookie);
            return true;
        }
        else {
            return false;
        }
    };


    const logOut = () => {
        //remove from redux
        dispatch(setCurrentUserId(null));
        dispatch({ type: 'SET_CURRENT_USER_FULL_NAME', payload: null });
        dispatch({ type: 'SET_CURRENT_USER_TYPE', payload: null });
        dispatch({ type: 'SET_CURRENT_USER_PROFILE_PIC_PATH', payload: null });
        //remove cookies
        Cookies.remove("userId");
        Cookies.remove("authenticationToken");
    };

    const getUserInfo = async (userId) => {
        const response = await fetch(`http://localhost:8080/api/users/?id=${userId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const result = await response.json();
        if (response.ok) {
            return result;
        } else {
            alert(`Get info failed: ${result.message}`);
            return null;
        }
    };

    const getOwnerInfo = async (userid) => {
        const response = await fetch(`http://localhost:8080/api/owners/${userid}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const result = await response.json();
        if (response.ok) {
            return result;
        } else {
            alert(`Get info failed: ${result.message}`);
            return null;
        }
    };

    const getCenterInfo = async (centerId) => {
        const response = await fetch(`http://localhost:8080/api/centers/${centerId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const result = await response.json();
        if (response.ok) {
            return result;
        } else {
            alert(`Get center info failed: ${result.message}`);
            return null;
        }
    }

    const updateOwner = async (formData, profilePic, userid) => {
        const response = await fetch(`http://localhost:8080/api/update/owner/${userid}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                accountType: "Owner",
                emailAddress: formData.emailAddress,
                password: formData.password,
                nameFirst: formData.nameFirst,
                nameLast: formData.nameLast
            })
        });

        const result = await response.json();
        if (response.ok) {
            if (profilePic != null) {
                const profilePicResult = await uploadProfilePic(profilePic, userid);
                if (!profilePicResult) {
                    return null;
                }
            }
            saveCurrentUserToRedux(result.userid);
            return result;
        } else {
            alert(`Update failed: ${result.message}`);
            return null;
        }
    };
    const updateCenter = async (formData, profilePic, bannerPic, userid) => {
        const response = await fetch(`http://localhost:8080/api/update/center/${userid}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                accountType: "Center",
                emailAddress: formData.emailAddress,
                password: formData.password,
                name: formData.name,
                description: formData.description,
                address: formData.address,
                city: formData.city,
                state: formData.state,
                zipCode: formData.zipCode
            })
        });

        const result = await response.json();
        if (response.ok) {
            saveCurrentUserToRedux(userid);
            //try to upload banner and profile pic if they exist
            if (profilePic != null) {
                const profilePicResult = await uploadProfilePic(profilePic, userid);
                if (!profilePicResult) {
                    return null;
                }
            }
            if (bannerPic != null) {
                const bannerPicResult = await uploadCenterBanner(bannerPic, userid);
                if (!bannerPicResult) {
                    return null;
                }
            }
            //return wheter or not both were successful
            return result;
        } else {
            alert(`Update failed: ${formResult.message}`);
            return null;
        }
    };

    return {
        validateLogin,
        registerCenter,
        registerOwner,
        logOut,
        getUserInfo,
        getOwnerInfo,
        getCenterInfo,
        updateOwner,
        updateCenter,
        authenticateFromCookie,
    };

};
export default userService;