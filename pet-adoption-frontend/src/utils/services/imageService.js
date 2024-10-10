import { useDispatch, useSelector } from 'react-redux';
import { setCurrentUserId } from '@/utils/redux';
import Cookies from 'js-cookie';

const imageService = () => {
    const dispatch = useDispatch();
    const currentUserId = useSelector((state) => state.currentUser.currentUserId);



    // registers and logs in a new center
    const uploadProfilePic = async (formData) => {
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
        if (response.ok) {
            saveCurrentUserToRedux(result.userid);
            setAuthenticationCookies(result.userid);
            return result;
        } else {
            alert(`Registration failed: ${result.message}`);
            return null;
        }
    };



    return {
        uploadProfilePic,
    };

};
export default imageService;