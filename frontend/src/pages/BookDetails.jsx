import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { addCartItem, fetchPreferences } from '../features/ecommerceSlice';
import { fetchBookDetails, fetchBooks, fetchGenre } from '../features/bookSlice';
import PreferenceButtons from '../components/PreferenceButtons';
import { NavLink } from 'react-router-dom';
import { toast } from 'react-toastify';

function BookDetails() {
    const dispatch = useDispatch();
    const { bookId } = useParams();
    const navigate = useNavigate();

    const user = useSelector((state) => state.auth.user);
    const authTokens = useSelector((state) => state.auth.authTokens);
    const { bookDetails, books_status, details_status } = useSelector((state) => state.books);
    const genre = useSelector((state) => state.books.genre);
    const preferences = useSelector((state) => state.ecommerce.preferences);

    const [isAdmin, setIsAdmin] = useState(false);
    const [isBuyer, setIsBuyer] = useState(false);
    const [quantity, setQuantity] = useState(1);

    const increment = () => setQuantity((prev) => prev + 1);
    const decrement = () => quantity > 1 && setQuantity((prev) => prev - 1);

    const addToCart = async () => {
        try {
            await dispatch(addCartItem({ bookId: bookDetails.id, quantity })).unwrap();
            toast.success('Item added to cart!');
            navigate('/cart');
        } catch (error) {
            toast.error('Failed to add item to cart!');
            console.error('Failed to add item to cart!', error);
        }
    };

    useEffect(() => {
        if (books_status === 'idle') dispatch(fetchBooks());
        dispatch(fetchBookDetails(bookId));
        dispatch(fetchGenre());
    }, [dispatch, books_status]);

    useEffect(() => {
        if (user) {
            setIsAdmin(user.is_staff);
            setIsBuyer(!user.is_staff);
        }
    }, [user]);

    useEffect(() => {
        if (isBuyer) dispatch(fetchPreferences());
    }, [dispatch, isBuyer]);

    if (details_status === 'loading' || books_status === 'loading') {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (details_status === 'failed') {
        return (
            <div className="alert alert-danger text-center mt-5">
                Failed to fetch book details. Please try again later.
            </div>
        );
    }

    if (!bookDetails) {
        return (
            <div className="alert alert-warning text-center mt-5">
                No book details available.
            </div>
        );
    }

    return (
        <div className="container my-5">
            <div className="row g-4">
                <div className="col-md-5">
                    <img
                        src={bookDetails.book_image || 'https://images.theconversation.com/files/45159/original/rptgtpxd-1396254731.jpg?ixlib=rb-4.1.0&q=45&auto=format&w=754&fit=clip'}
                        alt={bookDetails.title}
                        className="img-fluid rounded shadow-lg"
                    />
                </div>

                <div className="col-md-7">
                    <h2 className="fw-bold mb-3">{bookDetails.title}</h2>
                    <p><strong>Author:</strong> {bookDetails.author}</p>
                    <p><strong>Genre:</strong> {genre[bookDetails.genre_id]?.name || 'Unknown'}</p>
                    <p><strong>Description:</strong> {bookDetails.description}</p>
                    <p className="text-success fw-bold fs-4">₹{bookDetails.price}</p>

                    {isBuyer && (
                        <div className="mt-4">
                            <h5>Your Preference</h5>
                            <PreferenceButtons bookId={bookDetails.id} />

                            <div className="d-flex align-items-center gap-3 mt-3">
                                <button className="btn btn-outline-danger btn-sm" onClick={decrement} disabled={quantity === 1}>-</button>
                                <span className="px-3 py-2 border rounded">{quantity}</span>
                                <button className="btn btn-outline-success btn-sm" onClick={increment}>+</button>
                            </div>

                            <button className="btn btn-primary w-100 mt-3" onClick={addToCart}>
                                Add to Cart
                            </button>
                        </div>
                    )}

                    {isAdmin && (
                        <div className="mt-5">
                            <h4>Admin Actions</h4>
                            <div className="d-flex gap-3">
                                <NavLink to={`/edit_book/${bookDetails.id}`} className="btn btn-warning">
                                    Edit Book
                                </NavLink>
                                <button className="btn btn-danger" onClick={() => toast.info('Delete functionality pending')}>Delete Book</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default BookDetails;
