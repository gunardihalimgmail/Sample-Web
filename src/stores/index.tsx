import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import menuReducer from "./reducersState";

const rootReducer = combineReducers({
    menuReducer
})

const storeMenu = configureStore({
    reducer:rootReducer
});

export default storeMenu;