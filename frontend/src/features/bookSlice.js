import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';



export const fetchBooks = createAsyncThunk('books/fetchBookList', async () => {
    const response = await api.get('api/books/');
    return response.data;
});

export const fetchBookDetails = createAsyncThunk('books/fetchBook', async (bookId, { rejectWithValue }) => {
    try {
        const response = await api.get(`api/books/book_details/${bookId}/`);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response ? error.response.data : error.message);
    }
});


export const fetchGenre = createAsyncThunk('books/fetchGenere', async () => {
    const response = await api.get('api/books/genre/');
    return response.data;
});

// Initial state
const initialState= {
        book_list: [],
        bookDetails:null,
        genre: [],
        status: 'idle',
        gen_status:'idle',
        details_status:'idle',
        error: null,
        gen_error:null,
        details_error:null
        
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
            })
            
            
            .addCase(fetchBookDetails.pending, (state) => {
                state.details_status = 'loading';
            })
            .addCase(fetchBookDetails.fulfilled, (state, action) => {
                state.details_status = 'succeeded';
                state.bookDetails = action.payload;
            })
            .addCase(fetchBookDetails.rejected, (state, action) => {
                state.details_status = 'failed';
                state.details_error = action.error.message;
            });
    },
})

export default bookSlice.reducer;
