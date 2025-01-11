import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import api from '../services/api'; // Ensure this points to your Axios instance

// Thunks for asynchronous operations

// Fetch Cart
export const fetchCart = createAsyncThunk('cart/fetchCart', async (name, { rejectWithValue }) => {
    try {
        const response = await api.get(`/api/users/cart/?name=${encodeURIComponent(name)}`);
        return response.data;
    } catch (error) {
        toast.error('Failed to fetch cart!');
        return rejectWithValue(error.response ? error.response.data : error.message);
    }
});


// Add Cart Item
export const addCartItem = createAsyncThunk('cart/addCartItem', async ({ bookId, quantity }, { rejectWithValue }) => {
    try {
        console.log("bookId, quantity slice: ", bookId, quantity);

        // Fix: Send the correct key "book" instead of "bookId"
        const response = await api.post('api/users/cart/', {bookId, quantity });
        toast.success('Item added to cart successfully!');
        return response.data;
    } catch (error) {
        toast.error('Failed to add item to cart!');
        return rejectWithValue(error.response ? error.response.data : error.message);
    }
});

// Place Order
export const placeOrder = createAsyncThunk('order/placeOrder', async (orderData, { rejectWithValue }) => {
    try {
        const response = await api.post('/api/users/orders/', orderData);
        toast.success('Order placed successfully!');
        return response.data;
    } catch (error) {
        toast.error('Failed to place order!');
        return rejectWithValue(error.response ? error.response.data : error.message);
    }
});

// Fetch Orders
export const fetchOrders = createAsyncThunk('order/fetchOrders', async (_, { rejectWithValue }) => {
    try {
        const response = await api.get(`/api/users/orders/`);
        return response.data;
    } catch (error) {
        toast.error('Failed to fetch order details!');
        return rejectWithValue(error.response ? error.response.data : error.message);
    }
});

// Fetch Preferences
export const fetchPreferences = createAsyncThunk('preferences/fetchPreferences', async (_, { rejectWithValue }) => {
    try {
        const response = await api.get(`/api/users/preferences/`);
        return response.data;
    } catch (error) {
        toast.error('Failed to fetch preferences!');
        return rejectWithValue(error.response ? error.response.data : error.message);
    }
});

// Update or Create Preference
export const updatePreference = createAsyncThunk('preferences/updatePreference', async ({ userId, bookId, preference }, { rejectWithValue }) => {
    try {
        
        const response = await api.post(`/api/users/preferences/`, { userId, bookId, preference });
        toast.success('Preference updated successfully!');
        return response.data;
    } catch (error) {
        toast.error('Failed to update preference!');
        return rejectWithValue(error.response ? error.response.data : error.message);
    }
});

// Initial state
const initialState = {
    cart: null,
    preferences: [],
    orders: [],
    status: 'idle',
    error: null,
};

// Slice definition
const ecommerceSlice = createSlice({
    name: 'ecommerce',
    initialState,
    reducers: {
        resetCart(state) {
            state.cart = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Cart
            .addCase(fetchCart.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.cart = action.payload;
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })


            // Add Cart Item
            .addCase(addCartItem.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(addCartItem.fulfilled, (state, action) => {
                state.status = 'succeeded';
                if (state.cart) {
                    state.cart.items.push(action.payload);
                }
            })
            .addCase(addCartItem.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            // Place Order
            .addCase(placeOrder.fulfilled, (state, action) => {
                state.orders.push(action.payload);
                state.cart = null; // Reset cart after order placement
            })
            .addCase(placeOrder.rejected, (state, action) => {
                state.error = action.payload;
            })

            // Fetch Order
            .addCase(fetchOrders.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.orders = action.payload;
            })
            .addCase(fetchOrders.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            

            // Fetch Preferences
            .addCase(fetchPreferences.pending, (state) => {
                state.status = 'loading';
                state.error = null; // Reset error
            })
            .addCase(fetchPreferences.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.preferences = action.payload;
            })
            .addCase(fetchPreferences.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            // Update Preference
            .addCase(updatePreference.fulfilled, (state, action) => {
                const { user, book, preference } = action.payload;
                if (!state.preferences) state.preferences = [];
                const existing = state.preferences.find((pref) => pref.user === user && pref.book === book);
                if (existing) {
                    existing.preference = preference;
                } else {
                    state.preferences.push({ user, book, preference });
                }
            })
            .addCase(updatePreference.rejected, (state, action) => {
                state.error = action.payload;
            });
    },
});

// Export actions
export const { resetCart } = ecommerceSlice.actions;

// Export reducer
export default ecommerceSlice.reducer;
