import { message } from "antd";

export const isLogin = () => {
    return localStorage.getItem("token") ? true : false;
};

export const isCompleteInfos = (state) => {
    return state.isCompleteInfos;
};

export const openMessageSuccess = (msg) => {
    setTimeout(() => {
        message.success(msg, 3);
    }, 3000);
};

export const openMessageError = (msg) => {
    setTimeout(() => {
        message.error(msg, 3);
    }, 3000);
};