import axios from '../utils/customize.axios';

//* Notify Actions
export const matchingAction = async (token) => {
    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    };

    try {
        const res = await axios.get(
            `${process.env.REACT_APP_API_URL}/matchers/list`,
            config
        );

        if (res.data) return res.data;
        return true;
    } catch (error) {
        return error.response?.data;
    }
};

//* Chat MSG Action
export const msgAction = async (token, id) => {
    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    };

    try {
        const res = await axios.get(
            `${process.env.REACT_APP_API_URL}/chat/messages/${id}`,
            config
        );

        if (res.data) return res.data;
        return true;
    } catch (error) {
        return error.response?.data;
    }
};
