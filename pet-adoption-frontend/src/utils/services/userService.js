import { useDispatch } from 'react-redux';
import { setCurrentUserId } from '@/utils/redux';




const UserService = () => {
    //const //dispatch = useDispatch();


    //validates the user login. Returns the user ID if successful, null otherwise
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
            //   this.saveCurrentUserToRedux(result.userId);
            return result.userid;
        } else {
            return null;
        }
    };

    // async saveCurrentUserToRedux(userId) {
    //     this.dispatch(setCurrentUserId(userId));
    // };

    return {
        validateLogin,
    };

};
export default UserService;