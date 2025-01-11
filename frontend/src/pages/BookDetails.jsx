import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { addCartItem, fetchCart, fetchPreferences } from '../features/ecommerceSlice';
import { fetchBookDetails, fetchBooks, fetchGenre } from '../features/bookSlice';
import PreferenceButtons from '../components/PreferenceButtons';

function BookDetails() {
    const dispatch = useDispatch();
    const { bookId } = useParams();

    const user = useSelector((state) => state.auth.user);
    const authTokens = useSelector((state) => state.auth.authTokens);
    const { bookDetails, books_status, details_status } = useSelector((state) => state.books);
    const genre = useSelector((state) => state.books.genre);
    const preferences = useSelector((state) => state.ecommerce.preferences);
    const navigate = useNavigate()
    const [isAdmin, setIsAdmin] = useState(false);
    const [isBuyer, setIsBuyer] = useState(false);

    const [quantity, setQuantity] = useState(1)

    const increment = () => {
        setQuantity((prev) => prev + 1);
    };

    const decrement = () => {
        if (quantity > 1) {
            setQuantity((prev) => prev - 1);
        }
    };

    const addToCart = async()=>{

        try {
            await dispatch(addCartItem({bookId:bookDetails.id, quantity})).unwrap(); // Dispatch the action and wait for it to complete
            navigate('/cart'); // Redirect to the cart page
        } catch (error) {
            console.error('Failed to add item to cart!',error);
        }
        // dispatch(fetchCart(user.username))
    }
    

    // Fetch data on initial render
    useEffect(() => {
        if (books_status === 'idle') {
            dispatch(fetchBooks());
        }
        if (details_status === 'idle') {
            dispatch(fetchBookDetails(bookId));
        }
        dispatch(fetchGenre());
    }, [dispatch, books_status, details_status, bookId]);

    // Determine user role
    useEffect(() => {
        if (user) {
            if (user.is_staff) {
                setIsAdmin(true);
            } else {
                setIsBuyer(true);
            }
        }
    }, [user]);

    
    // Fetch user preferences if the user is a buyer
    useEffect(() => {
        if (isBuyer) {
            dispatch(fetchPreferences());
        }
    }, [dispatch, isBuyer]);

    // Render loading or error messages
    if (details_status === 'loading' || books_status === 'loading') {
        return <div>Loading...</div>;
    }

    if (details_status === 'failed') {
        return <div className="text-danger">Failed to fetch book details. Please try again later.</div>;
    }

    if (!bookDetails) {
        return <div>No book details available.</div>;
    }

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-6">
                    <img
                        src={`${import.meta.env.VITE_API_URL}${bookDetails.book_image}` || 'https://images.theconversation.com/files/45159/original/rptgtpxd-1396254731.jpg?ixlib=rb-4.1.0&q=45&auto=format&w=754&fit=clip'}
                        alt={bookDetails.title}
                        className="img-fluid rounded shadow-sm"
                    />
                </div>
                <div className="col-md-6">
                    <h2>{bookDetails.title}</h2>
                    <p><strong>Author:</strong> {bookDetails.author}</p>
                    <p><strong>Genre:</strong> {genre[bookDetails.genre_id]?.name || 'Unknown'}</p>
                    <p><strong>Description:</strong> {bookDetails.description}</p>
                    <p><strong>Price:</strong> ₹{bookDetails.price}</p>

                    {isBuyer && (
                        <>
                            <div className="mt-4">
                                <h5>Your Preference</h5>
                                

                                <PreferenceButtons bookId={bookDetails.id} />
                                
                            </div>

                            <div className="d-flex align-items-center justify-content-center gap-3">
                                <h5 className="fw-bold px-3 py-2" > Quantity: </h5>
                                
                                <button 
                                    className="btn btn-outline-danger"
                                    onClick={decrement}
                                    disabled={quantity === 1}
                                >
                                    -
                                </button>
                                <div className="fw-bold px-3 py-2 border rounded" style={{ minWidth: '50px', textAlign: 'center' }}>
                                     {quantity}
                                </div>
                                <button 
                                    className="btn btn-outline-success"
                                    onClick={increment}
                                >
                                    +
                                </button>
                            </div>
                            <div className="d-flex align-items-center justify-content-center gap-3">
                                <button onClick={()=> addToCart()} className="btn btn-primary d-flex align-items-center justify-content-center">Add to Cart</button>
                            </div>
                            
                            
                        </>
                    )}
                </div>
            </div>

            {/* Admin Section */}
            {isAdmin && (
                <div className="mt-5">
                    <h4>Admin Actions</h4>
                    <p className="text-muted">Admins can manage book details here.</p>
                    {/* Add Admin management actions */}
                </div>
            )}

            {/* Related Books */}
            {/* <div className="mt-5">
                <h4>Related Books</h4>
                <div className="row">
                    {book_list
                        .filter((book) => book.genre_id === bookDetails.genre_id && book.id !== bookDetails.id)
                        .slice(0, 4) // Limit to 4 related books
                        .map((relatedBook) => (
                            <div key={relatedBook.id} className="col-md-3 mb-4">
                                <div className="card">
                                    <img
                                        src={relatedBook.cover_image || '/default-book-cover.jpg'}
                                        alt={relatedBook.title}
                                        className="card-img-top"
                                    />
                                    <div className="card-body">
                                        <h5 className="card-title">{relatedBook.title}</h5>
                                        <p className="card-text">{relatedBook.author}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            </div> */}
        </div>
    );
}

export default BookDetails;
