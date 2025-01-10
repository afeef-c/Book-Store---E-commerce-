import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../features/authSlice';
import bookReducer from '../features/bookSlice';

const store = configureStore({
    reducer:{
        auth: authReducer,
        books: bookReducer,
    }
})

export default store;