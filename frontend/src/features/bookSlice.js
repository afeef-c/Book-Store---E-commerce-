import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';



export const fetchBooks = createAsyncThunk('books/fetchCourses', async () => {
    const response = await api.get('api/books/');
    return response.data;
});

export const fetchGenre = createAsyncThunk('books/fetchGenere', async () => {
    const response = await api.get('api/books/genre/');
    return response.data;
});

// Initial state
const initialState= {
        book_list: [],
        genre: [],
        status: 'idle',
        gen_status:'idle',
        error: null,
        gen_error:null,
        
    };


const bookSlice = createSlice({
    name:'books',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchBooks.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchBooks.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.book_list = action.payload;
            })
            .addCase(fetchBooks.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })

            .addCase(fetchGenre.pending, (state) => {
                state.gen_status = 'loading';
            })
            .addCase(fetchGenre.fulfilled, (state, action) => {
                state.gen_status = 'succeeded';
                state.genre = action.payload;
            })
            .addCase(fetchGenre.rejected, (state, action) => {
                state.gen_status = 'failed';
                state.gen_error = action.error.message;
            });
    },
})

export default bookSlice.reducer;
