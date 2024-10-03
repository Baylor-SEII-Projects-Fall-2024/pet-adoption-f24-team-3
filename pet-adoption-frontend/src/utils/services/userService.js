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
        console.log("USER ID:", result.userid);

        if (response.ok) {
            //dispatch(setCurrentUserId(result.userid));
            saveCurrentUserToRedux(result.userid);
            return result.userid;
        } else {
            return null;
        }
    };

    //fetch a few
    const saveCurrentUserToRedux = (userid) => {
        dispatch(setCurrentUserId(userid));
    };

    return {
        validateLogin,
    };

};
export default userService;