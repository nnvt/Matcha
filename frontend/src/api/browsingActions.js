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
            "https://matchaa-backend-7bfca7ce8452.herokuapp.com/api/users/find/suggestions",
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
            "https://matchaa-backend-7bfca7ce8452.herokuapp.com/api/users/search",
            search,
            config
        );

        if (res.data) return res.data;
        return false;
    } catch (error) {
        return error.response?.data;
    }
};
