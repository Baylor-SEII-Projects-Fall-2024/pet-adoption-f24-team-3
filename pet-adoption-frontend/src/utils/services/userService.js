import { useDispatch } from 'react-redux';
import { setCurrentUserId } from '@/utils/redux';




const userService = () => {
    // const dispatch = useDispatch();


    //  validates the user login.Returns the user ID if successful, null otherwise
    const validateLogin = async (email, password, dispatch) => {
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
        console.log(result);
        if (response.ok) {
            dispatch(setCurrentUserId(result.userId));
            //saveCurrentUserToRedux(result.userId);
            return result.userid;
        } else {
            return null;
        }
    };


    const saveCurrentUserToRedux = async (userId) => {
        console.log("Dispatching ", userId);
        dispatch(setCurrentUserId(userId));
    };

    return {
        validateLogin,
    };

};
export default userService;