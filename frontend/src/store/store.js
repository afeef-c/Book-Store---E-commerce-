import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../features/authSlice';
import bookReducer from '../features/bookSlice';
import ecommerceReducer from '../features/ecommerceSlice';


const store = configureStore({
    reducer:{
        auth: authReducer,
        books: bookReducer,
        ecommerce: ecommerceReducer
    }
})

export default store;