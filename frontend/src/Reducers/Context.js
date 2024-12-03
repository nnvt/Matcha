import React, { createContext, useReducer, useEffect } from "react";
import { InitialState, UserReducer } from "./UserReducer";
import { getUserAction } from "../api/userActions";
import { socketConn as socket } from "../utils/sockets";

export const Context = createContext(InitialState);

export const UserProvider = ({ children }) => {
    const [state, dispatch] = useReducer(UserReducer, InitialState);
    useEffect(() => {
        async function fetchData() {
            if (state.token) {
                await getUserAction(state.token, dispatch);
                socket.emit("userConneted", state.token);
            }
        }
        fetchData();
    }, [state.token, state.id]);

    return (
        <Context.Provider value={{ state, dispatch }}>{children}</Context.Provider>
    );
};
