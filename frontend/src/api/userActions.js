import axios from '../utils/customize.axios';
import { SUCCESS, FAILED, COMPLETE, USER_AUTH, LOGOUT } from '../assets/constant.js';
import { socketConn as socket } from '../utils/sockets.js';

// Register Action
export const registerAction = async (registerData) => {
    try {
        const res = await axios.post('/users/register', registerData);
        return res.data;
    } catch (error) {
        return error;
    }
};

// Login Action
export const loginAction = async (loginData, dispatch) => {
    try {
        const res = await axios.post('/users/login', loginData);
        const { token, message, success, isInfosComplete } = res.data;

        localStorage.setItem('token', token);
        socket.emit('login', token);

        dispatch({
            type: SUCCESS,
            payload: {
                success,
                successMessage: message,
                token,
                isCompleteInfos: isInfosComplete,
                username: loginData.username,
            },
        });

        return res.data;
    } catch (error) {
        return error;
    }
};

// Logout Action
export const logoutAction = (id, dispatch) => {
    localStorage.removeItem('token');
    socket.emit('logout', { userid: id });
    dispatch({ type: LOGOUT });
};

// Load User Data
export const setAuthUserData = (data, dispatch) => {
    try {
        dispatch({
            type: USER_AUTH,
            payload: { id: data.id, username: data.username },
        });
    } catch (error) {
        console.error('Set Auth User Data Error:', error);
    }
};

// Reset Password Action
export const resetAction = async (resetData) => {
    try {
        const res = await axios.post('/users/resetpassword', resetData);
        return res.data;
    } catch (error) {
        return error;
    }
};

// Change Password Action
export const changePasswordAction = async (newPassData, token) => {
    try {
        const data = {
            newpassword: newPassData.password,
            confirmpassword: newPassData.password,
            token,
        };
        const res = await axios.patch('/users/newpassword', data);
        return res.data;
    } catch (error) {
        return error;
    }
};

// Get User Info
export const getUserAction = async (token, dispatch) => {
    try {
        const res = await axios.get('/users/verify/isinfoscompleted');
        const { success, complete, username, userid } = res.data;

        dispatch({
            type: COMPLETE,
            payload: {
                success,
                isCompleteInfos: complete,
                username,
                id: userid,
            },
        });
        return true;
    } catch (error) {
        dispatch({
            type: FAILED,
            payload: { success: false, error: error.message },
        });
        return false;
    }
};

// Complete User Info
export const stepsAction = async (token, userData, dispatch) => {
    const config = {
        headers: { 'Content-Type': 'multipart/form-data' },
    };

    let form = new FormData();
    form.set('gender', userData.gender);
    form.set('looking', userData.interest);
    form.set('bio', userData.bio);
    form.set('tags', userData.tags.map((item) => item.substring(1)).join(','));
    form.set('birthday', new Date(userData.birthday._d).toISOString());
    form.set('lat', userData.lat);
    form.set('lang', userData.lang);
    form.set('country', userData.country);
    form.set('city', userData.city);

    if (userData.profile.length) form.append('profile', userData.profile[0]);
    userData.gallery.forEach((element) => form.append('gallery', element));

    try {
        const res = await axios.patch('/users/completeinfos', form, config);
        return res.data;
    } catch (error) {
        return error;
    }
};

// Check if Token is Valid
export const checkTokenAction = async (token) => {
    try {
        const res = await axios.post('/users/verify/token', { token });
        if (res.data.valide) return res.data.valide;
        else {
            localStorage.removeItem('token');
            return false;
        }
    } catch (error) {
        localStorage.removeItem('token');
        return false;
    }
};
