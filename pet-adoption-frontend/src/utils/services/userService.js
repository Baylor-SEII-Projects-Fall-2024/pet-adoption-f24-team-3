import { useDispatch, useSelector } from 'react-redux';
import { setCurrentUserId } from '@/utils/redux';




const userService = () => {
    const dispatch = useDispatch();
    const currentUserId = useSelector((state) => state.currentUser.currentUserId);

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
            return result.userid;
        } else {
            return null;
        }
    };

    // registers and logs in a new center
    const registerCenter = async (formData) => {
        const response = await fetch("http://localhost:8080/api/centers", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                accountType: "Center",
                emailAddress: formData.email,
                password: formData.password,
                profilePicPath: null,
                name: formData.centerName,
                address: formData.address,
                city: formData.city,
                state: formData.state,
                zipCode: formData.zip,
                description: "A safe haven for homeless pets",
                bannerPicPath: null
            })
        });

        const result = await response.json();
        console.log("result:", result);
        if (response.ok) {
            saveCurrentUserToRedux(result.userid);
            return result;
        } else {
            alert(`Registration failed: ${result.message}`);
            return null;
        }
    };

    const registerOwner = async (formData) => {
        const response = await fetch("http://localhost:8080/api/owners", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                accountType: "Owner",
                emailAddress: formData.email,
                password: formData.password,
                profilePicPath: null,
                nameFirst: formData.firstName,
                nameLast: formData.lastName
            })
        });

        const result = await response.json();
        console.log("result:", result);
        if (response.ok) {
            saveCurrentUserToRedux(result.userid);
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
        console.log("SESSION DATA:", result);
        if (getSessionUserData.ok) {
            dispatch({ type: 'SET_CURRENT_USER_FULL_NAME', payload: result.userFullName });
            dispatch({ type: 'SET_CURRENT_USER_TYPE', payload: result.userType });
            dispatch({ type: 'SET_CURRENT_USER_PROFILE_PIC_PATH', payload: result.profilePicPath });
        } else {
            console.error("Error: Unable to fetch session data for user!")
        }

    };

    const logOut = () => {
        dispatch(setCurrentUserId(null));
        dispatch({ type: 'SET_CURRENT_USER_FULL_NAME', payload: null });
        dispatch({ type: 'SET_CURRENT_USER_TYPE', payload: null });
        dispatch({ type: 'SET_CURRENT_USER_PROFILE_PIC_PATH', payload: null });
    };

    const getUserInfo = async (userid) => {
        const response = await fetch(`http://localhost:8080/api/owners/${userid}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const result = await response.json();
        console.log("result:", result);
        if (response.ok) {
            return result;
        } else {
            alert(`Registration failed: ${result.message}`);
            return null;
        }
    };

    return {
        validateLogin,
        registerCenter,
        registerOwner,
        logOut,
        getUserInfo,
    };

};
export default userService;