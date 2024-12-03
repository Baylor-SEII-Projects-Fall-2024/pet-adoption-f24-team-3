import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { setAuthenticationToken, setCurrentUserId } from '@/utils/redux';
import Cookies from 'js-cookie';
import imageService from './imageService';
import { useChat } from '../contexts/chatContext';
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const userService = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const { uploadProfilePic, uploadCenterBanner } = imageService();
    const { setCurrentChatId } = useChat();


    //  validates the user login.Returns the user ID if successful, null otherwise
    const validateLogin = async (email, password) => {
        const response = await fetch(`${apiUrl}/api/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                emailAddress: email,
                password: password,
            })
        });
        const result = await response.json();
        if (response.ok) {
            setAuthenticationCookie(result.token);
            await saveCurrentUserToRedux(result.token);

            return result.userId;
        } else {
            return null;
        }
    };


    // registers and logs in a new center
    const registerCenter = async (formData, profilePic, bannerPic) => {
        const response = await fetch(`${apiUrl}/api/auth/register/center`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
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
            await setAuthenticationCookie(result.token);
            await saveCurrentUserToRedux(result.token);
            if (profilePic != null) {
                const profilePicResult = await uploadProfilePic(profilePic, result.userId);
                if (!profilePicResult) {
                    return null;
                }
            }
            if (bannerPic != null) {
                const bannerPicResult = await uploadCenterBanner(bannerPic, result.userId);
                if (!bannerPicResult) {
                    return null;
                }
            }

            return result;
        } else {
            alert(`Registration failed: ${result.message}`);
            return null;
        }
    };

    const registerOwner = async (formData, profilePic) => {
        const response = await fetch(`${apiUrl}/api/auth/register/owner`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
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
            setAuthenticationCookie(result.token);
            await saveCurrentUserToRedux(result.token);
            if (profilePic != null) {
                const imageResult = await uploadProfilePic(profilePic, result.userId);
                if (!imageResult) {
                    return null;
                }
            }
            return result;
        } else {
            alert(`Registration failed: ${result.message}`);
            return null;
        }
    };

    //fetch a few pieces of user data to retain across the session for ease of access
    //also sets the user id in redux, which is needded to access restricted pages
    const saveCurrentUserToRedux = async (token) => {

        const getSessionUserData = await fetch(`${apiUrl}/api/users/sessionData`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "Authentication": `Bearer: ${token}`,
            }
        });

        if (getSessionUserData.ok) {
            const result = await getSessionUserData.json();
            dispatch(setCurrentUserId(result.userId));
            dispatch({ type: 'SET_CURRENT_USER_FULL_NAME', payload: result.userFullName });
            dispatch({ type: 'SET_CURRENT_USER_TYPE', payload: result.accountType });
            return true;
        } else {
            console.error("Error: User authentication failed!")
            return false;
        }

    };

    const setAuthenticationCookie = async (token) => {
        Cookies.set('authenticationToken', token, { expires: 7 });
    }

    // validates the user using user id and authentication token stored in cookie
    const authenticateFromCookie = async () => {
        const authTokenCookie = Cookies.get('authenticationToken');

        if (authTokenCookie) {
            saveCurrentUserToRedux(authTokenCookie)
                .then((result) => {
                    if (!result) onAuthenticationFailed();
                    return result;
                })
                .catch((error) => {
                    console.error("Error authenticating from cookie:", error);
                    onAuthenticationFailed();
                    return false;
                })
        }
        else {
            //dont want to change their routing, in case they never logged in at all
            logOut();
            return false;
        }
    };
    const onAuthenticationFailed = () => {
        // if authentication failed, logout and route to login screen
        logOut();
        console.log("Auth failed, kicking to login");
        router.push("/login");
    }

    const logOut = () => {
        //remove from redux
        dispatch(setCurrentUserId(null));
        dispatch({ type: 'SET_CURRENT_USER_FULL_NAME', payload: null });
        dispatch({ type: 'SET_CURRENT_USER_TYPE', payload: null });
        dispatch({ type: 'SET_CURRENT_USER_PROFILE_PIC_PATH', payload: null });
        //remove cookies
        Cookies.remove("authenticationToken");
        Cookies.remove("userId")
        //reset the chat
        setCurrentChatId(null);

    };

    const getUserInfo = async (userId) => {
        const response = await fetch(`${apiUrl}/api/users/?id=${userId}`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
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
        const response = await fetch(`${apiUrl}/api/owners/${userid}`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
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
        const response = await fetch(`${apiUrl}/api/centers/${centerId}`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
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
    const getGenericUserInfo = async (userid) => {
        const response = await fetch(`${apiUrl}/api/users/${userid}/generic`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            }
        });

        const result = await response.json();
        if (response.ok) {
            return result;
        } else {
            alert(`Get generic user info failed: ${result.message}`);
            return null;
        }
    };


    const getCenterDetails = async (centerId) => {
        const response = await fetch(`${apiUrl}/api/centers/${centerId}/details`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            }
        });

        const result = await response.json();
        if (response.ok) {
            return result;
        } else {
            alert(`Get center details failed: ${result.message}`);
            return null;
        }
    }

    const getCentersByPage = async (pageSize, pageNumber) => {
        const response = await fetch(`${apiUrl}/api/centers/paginated?pageSize=${pageSize}&pageNumber=${pageNumber}`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            }
        });

        const result = await response.json();
        if (response.ok) {
            return result;
        } else {
            console.error(`Getting centers failed ${result.message}`);
            return null;
        }
    }

    const updateOwner = async (formData, profilePic, userid) => {
        const response = await fetch(`${apiUrl}/api/update/owner/${userid}`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
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
        const response = await fetch(`${apiUrl}/api/update/center/${userid}`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
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

    const checkOldPasswordAndChange = async (formData, userid) => {
        // Check if old password matches database
        const checkResponse = await fetch(`${apiUrl}/api/check-old-password/${userid}`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                oldPassword: formData.oldPassword, // Send the old password for verification
            }),
        });

        const checkResult = await checkResponse.json();

        // If old password check fails, return the error message
        if (!checkResponse.ok) {
            return { success: false, message: checkResult.message };
        }

        // If old password is correct, continue with changing password
        const updateResponse = await fetch(`${apiUrl}/api/change-password/${userid}`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                newPassword: formData.newPassword,
            }),
        });

        const updateResult = await updateResponse.json();

        if (updateResponse.ok) {
            // Return success message
            return { success: true, message: "Password updated successfully" };
        } else {
            // Return error message
            return { success: false, message: updateResult.message || "Failed to update password" };
        }
    };

    return {
        validateLogin,
        registerCenter,
        registerOwner,
        logOut,
        getUserInfo,
        getOwnerInfo,
        getGenericUserInfo,
        getCenterInfo,
        getCentersByPage,
        updateOwner,
        updateCenter,
        authenticateFromCookie,
        getCenterDetails,
        checkOldPasswordAndChange,
    };

};
export default userService;
