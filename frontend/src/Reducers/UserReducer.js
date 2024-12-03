import {
    SUCCESS, FAILED, USER_AUTH, COMPLETE, LOGOUT, EDIT_SUCCESS, REMOVE_ERRORS
} from "../assets/constant.js"

const token = localStorage.getItem("token");

export const InitialState = {
    success: false,
    successMessage: "",
    errorMessage: "",
    isCompleteInfos: false,
    token: token,
    username: "",
    id: "",
    errors: {
        username: "",
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        confirmpassword: "",
    },
};

export const UserReducer = (state = InitialState, action) => {
    const { type, payload } = action;

    switch (type) {
        case SUCCESS:
            return {
                ...state,
                success: payload.success,
                successMessage: payload.successMessage,
                token: payload.token,

                username: payload.username,
            };
        case USER_AUTH:
            return {
                ...state,
                user: {
                    id: payload.id,
                },
            };
        case EDIT_SUCCESS:
            return {
                ...state,
                success: payload.success,
                successMessage: payload.successMessage,
            };
        case COMPLETE:
            return {
                ...state,
                success: payload.success,
                isCompleteInfos: payload.isCompleteInfos,
                username: payload.username,
                id: payload.id,
            };
        case FAILED:
            return { ...state, errorMessage: payload.error, success: false };
        case REMOVE_ERRORS:
            return { ...state, errorMessage: "" };
        case LOGOUT:
            return {
                ...state,
                token: "",
                isCompleteInfos: false,
                username: "",
                id: "",
                successMessage: "",
            };
        default:
            throw new Error();
    }
};
