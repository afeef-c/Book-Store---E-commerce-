import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBooks, fetchGenre } from "../features/bookSlice";
import { NavLink } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-toastify";
import { fetchPreferences } from "../features/ecommerceSlice";
import PreferenceButtons from "./PreferenceButtons";

function BookList() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const authTokens = useSelector((state) => state.auth.authTokens);
    const book_list = useSelector((state) => state.books.book_list);
    const genre = useSelector((state) => state.books.genre);
    const books_status = useSelector((state) => state.books.status);
    const books_error = useSelector((state) => state.books.error);
    const genre_status = useSelector((state) => state.books.gen_status);
    const genre_error = useSelector((state) => state.books.gen_error);
    const preferences = useSelector((state) => state.ecommerce.preferences);
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false)
    const [isBuyer , setIsBuyer ] = useState(false)

    // const handleLike = () => {
    //   setLikes((prevLikes) => prevLikes + 1);
    // };

    // const handleDislike = () => {
    //   setDislikes((prevDislikes) => prevDislikes + 1);
    // };

    useEffect(() => {
        if (books_status === "idle") {
            dispatch(fetchBooks());
        }
        if (genre_status === "idle") {
            dispatch(fetchGenre());
        }
        
    }, [dispatch, books_status, genre_status]);

    useEffect(()=>{
      if (user){
        if (user.is_staff){
          setIsAdmin(true)
        }
        else{
          setIsBuyer(true)
        }
      }

    },[user])

    useEffect(()=>{
      if (isBuyer){
        dispatch(fetchPreferences())
      }
    },[dispatch, isBuyer, user])
    
    console.log('preferences: ',preferences)


    const deleteBook = async (bookId) => {
      try {
          await api.delete(`/api/books/book_details/${bookId}/`, {
              headers: {
                  Authorization: `Bearer ${authTokens.access}`,
              },
          });
          toast.success('Book deleted successfully');
          dispatch(fetchBooks())
      } catch (error) {
          console.error('Error deleting book:', error.response ? error.response.data : error);
          toast.error('Failed to delete book');
      }
  };
  

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Books Collection</h2>

            {books_status === "loading" || genre_status === "loading" ? (
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : books_error || genre_error ? (
                <div className="alert alert-danger">
                    {books_error || genre_error}
                </div>
            ) : (
                <div className="row">
                    {book_list.map((book) => (
                        <div className="col-md-4 mb-4" key={book.id}>
                            <div className="card h-100">
                                <img
                                    // src={book.book_image||'https://images.theconversation.com/files/45159/original/rptgtpxd-1396254731.jpg?ixlib=rb-4.1.0&q=45&auto=format&w=754&fit=clip'}
                                    src={book.book_image || 'https://images.theconversation.com/files/45159/original/rptgtpxd-1396254731.jpg?ixlib=rb-4.1.0&q=45&auto=format&w=754&fit=clip'}

                                    className="card-img-top"
                                    alt={book.title}
                                    style={{ height: "200px", objectFit: "cover" }}
                                />
                                <div className="card-body">
                                    <h5 className="card-title">{book.title}</h5>
                                    <p className="card-text">
                                        Author: {book.author}
                                    </p>
                                    <p className="card-text">
                                        Genre: {book.genre?.name||  "Unknown"}
                                    </p>
                                    <p className="card-text text-success fw-bold">
                                        Price: ₹{book.price}
                                    </p>
                                </div>
                                <NavLink to={`/book_details/${book.id}`} className="btn btn-primary ">
                                  Details
                                </NavLink>
                                {isAdmin?
                                (<div>
                                <NavLink to={`/edit_book/${book.id}`} className="btn btn-primary ">
                                  Edit
                                </NavLink>
                                <button onClick={()=>deleteBook(book.id)} className="btn btn-danger">
                                  Delete
                                </button>
                                
                                </div>):
                                (<div className="card-footer text-center">
                                    
                                    <PreferenceButtons bookId={book.id}/>
                                </div>)
                                }
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default BookList;
