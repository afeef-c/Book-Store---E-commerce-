import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchBooks, fetchGenre } from '../features/bookSlice';

function BookList() {
    const dispatch = useDispatch();
    const user = useSelector(state => state.auth.user);
    const authTokens = useSelector((state) => state.auth.authTokens);
    const book_list = useSelector(state => state.books.book_list);
    const genre = useSelector(state => state.books.genre);;
    const books_status = useSelector(state => state.books.status);;
    const books_error = useSelector(state => state.books.error);;
    const genre_status = useSelector(state => state.books.gen_status);;
    const genre_error = useSelector(state => state.books.gen_error);;
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(()=> {
        if (books_status=='idle'){
            dispatch(fetchBooks())
        }
        if (genre_status=='idle'){
            dispatch(fetchGenre())
        }
    },[dispatch,books_status,genre_status])

    console.log("genre: ",genre)
    console.log("Books: ",book_list,books_status)
  return (
    <div>BookList</div>
  )
}

export default BookList