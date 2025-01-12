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
    
    const [isAdmin, setIsAdmin] = useState(false);
    const [isBuyer, setIsBuyer] = useState(false);

    useEffect(() => {
        if (books_status === "idle") {
            dispatch(fetchBooks());
        }
        if (genre_status === "idle") {
            dispatch(fetchGenre());
        }
    }, [dispatch, books_status, genre_status]);

    useEffect(() => {
        if (user) {
            setIsAdmin(user.is_staff);
            setIsBuyer(!user.is_staff);
        }
    }, [user]);

    useEffect(() => {
        if (isBuyer) {
            dispatch(fetchPreferences());
        }
    }, [dispatch, isBuyer]);

    const deleteBook = async (bookId) => {
        try {
            await api.delete(`/api/books/book_details/${bookId}/`, {
                headers: {
                    Authorization: `Bearer ${authTokens.access}`,
                },
            });
            toast.success("Book deleted successfully");
            dispatch(fetchBooks());
        } catch (error) {
            toast.error("Failed to delete book");
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">📚 Explore Our Book Collection</h2>
            {books_status === "loading" || genre_status === "loading" ? (
                <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : books_error || genre_error ? (
                <div className="alert alert-danger text-center">
                    {books_error || genre_error}
                </div>
            ) : book_list.length > 0 ? (
                <div className="row g-4">
                    {book_list.map((book) => (
                        <div className="col-md-4 col-sm-6" key={book.id}>
                            <div className="card h-100 shadow-sm border-0">
                                <img
                                    src={book.book_image || "https://via.placeholder.com/300x200?text=No+Image"}
                                    className="card-img-top"
                                    alt={book.title}
                                    style={{ height: "250px", objectFit: "cover" }}
                                />
                                <div className="card-body">
                                    <h5 className="card-title text-primary">{book.title}</h5>
                                    <p className="card-text">Author: {book.author}</p>
                                    <p className="card-text">Genre: {book.genre?.name || "Unknown"}</p>
                                    <p className="card-text text-success fw-bold">Price: ₹{book.price}</p>
                                </div>
                                <div className="d-flex justify-content-around mb-3">
                                    <NavLink to={`/book_details/${book.id}`} className="btn btn-outline-primary btn-sm">Details</NavLink>
                                    {isAdmin && (
                                        <>
                                            <NavLink to={`/edit_book/${book.id}`} className="btn btn-outline-warning btn-sm">Edit</NavLink>
                                            <button onClick={() => deleteBook(book.id)} className="btn btn-outline-danger btn-sm">Delete</button>
                                        </>
                                    )}
                                    {isBuyer && <PreferenceButtons bookId={book.id} />}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="alert alert-info text-center">
                    No books available at the moment. Please check back later!
                </div>
            )}
        </div>
    );
}

export default BookList;
