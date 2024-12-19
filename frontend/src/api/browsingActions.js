import axios from '../utils/customize.axios';

//* Browsing Actions
export const BrowsingAction = async (token, filters) => {
    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        params: filters,
    };

    try {
        const res = await axios.get(
            `${process.env.REACT_APP_API_URL}/users/find/suggestions`,
            config
        );

        if (res.data) return res.data;
        return false;
    } catch (error) {
        return error.response?.data;
    }
};

//* Search Actions
export const searchAction = async (token, search, filter) => {
    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        params: filter,
    };

    try {
        const res = await axios.post(
            `${process.env.REACT_APP_API_URL}/users/search`,
            search,
            config
        );

        if (res.data) return res.data;
        return false;
    } catch (error) {
        return error.response?.data;
    }
};
