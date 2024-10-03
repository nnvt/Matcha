export const isLogin = () => {
    return localStorage.getItem("token") ? true : false;
};

export const isCompleteInfos = (state) => {
    return state.isCompleteInfos;
};