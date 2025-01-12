import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { fetchUserDetails } from '../features/authSlice';
import { fetchBookDetails, fetchGenre } from "../features/bookSlice";
import api from '../services/api';
import { toast } from 'react-toastify';

function AddBook() {
    const dispatch = useDispatch();
    const user = useSelector(state => state.auth.user);
    const authTokens = useSelector(state => state.auth.authTokens);
    const navigate = useNavigate();
    const { bookId } = useParams();
    const { genre, bookDetails, gen_status, details_status } = useSelector((state) => state.books);
    const [isAdmin, setIsAdmin] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        genre: '',
        author: '',
        price: 0.00,
        book_image: null,
    });
    const [loading, setLoading] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    useEffect(() => {
        if (authTokens && !user) {
            dispatch(fetchUserDetails());
        }
        if (gen_status === 'idle') {
            dispatch(fetchGenre());
        }
        if (user?.is_staff) {
            setIsAdmin(true);
        }
    }, [authTokens, dispatch, user, gen_status]);

    useEffect(() => {
        if (bookId) {
            setIsEdit(true);
            dispatch(fetchBookDetails(bookId));
        }
    }, [bookId, dispatch]);

    useEffect(() => {
        if (isEdit && details_status === 'succeeded' && bookDetails) {
            
            setFormData({
                title: bookDetails.title || '',
                description: bookDetails.description || '',
                genre: bookDetails.genre.id || '',
                author: bookDetails.author || '',
                price: bookDetails.price || 0.00,
                book_image: bookDetails.book_image,
            });
        }
    }, [isEdit, details_status, bookDetails]);

    const handleInputChange = (e) => {
        const { name, value, type, files } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: type === 'file' ? files[0] : value,
        }));
    };

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     setLoading(true);

    //     if (isAdmin) {
    //         try {
    //             const data = new FormData();
    //             data.append('title', formData.title);
    //             data.append('description', formData.description);
    //             data.append('genre', formData.genre);
    //             data.append('author', formData.author);
    //             data.append('price', formData.price);
    //             if (formData.book_image) {
    //                 data.append('book_image', formData.book_image);
    //             }

    //             if (isEdit) {
                    
    //                 await api.put(`/api/books/book_details/${bookId}/`, data, {
                        
    //                     headers: {
    //                         Authorization: `Bearer ${authTokens.access}`,
    //                         'Content-Type': 'multipart/form-data',
    //                     },
    //                 });
                    
    //                 toast.success('Book updated successfully');
    //             } else {
    //                 await api.post('/api/books/', data, {
    //                     headers: {
    //                         Authorization: `Bearer ${authTokens.access}`,
    //                         'Content-Type': 'multipart/form-data',
    //                     },
    //                 });
    //                 toast.success('Book added successfully');
    //             }

    //             setFormData({
    //                 title: '',
    //                 description: '',
    //                 author: '',
    //                 genre: '',
    //                 price: 0.00,
    //                 book_image: null,
    //             });
    //             navigate('/book_list');
    //         } catch (error) {
    //             toast.error('Error saving book');
    //         } finally {
    //             setLoading(false);
    //         }
    //     } else {
    //         toast.warn("Only admins can add or update books");
    //         navigate('/book_list');
    //     }
    // };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
    
        if (isAdmin) {
            try {
                const data = new FormData();
                data.append('title', formData.title);
                data.append('description', formData.description);
                data.append('genre', formData.genre);
                data.append('author', formData.author);
                data.append('price', formData.price);
    
                // Append book_image only if it's a new file
                if (formData.book_image && typeof formData.book_image !== 'string') {
                    data.append('book_image', formData.book_image);
                }
    
                if (isEdit) {
                    await api.put(`/api/books/book_details/${bookId}/`, data, {
                        headers: {
                            Authorization: `Bearer ${authTokens.access}`,
                            'Content-Type': 'multipart/form-data',
                        },
                    });
                    toast.success('Book updated successfully');
                } else {
                    await api.post('/api/books/', data, {
                        headers: {
                            Authorization: `Bearer ${authTokens.access}`,
                            'Content-Type': 'multipart/form-data',
                        },
                    });
                    toast.success('Book added successfully');
                }
    
                setFormData({
                    title: '',
                    description: '',
                    author: '',
                    genre: '',
                    price: 0.00,
                    book_image: null,
                });
                navigate('/book_list');
            } catch (error) {
                toast.error('Error saving book');
            } finally {
                setLoading(false);
            }
        } else {
            toast.warn("Only admins can add or update books");
            navigate('/book_list');
        }
    };
    

    return (
        <div className="container my-5">
            <h2 className="text-center mb-4">{isEdit ? 'Update Book' : 'Add Book'}</h2>
            {isAdmin ? (
                <>
                    <div className="d-flex justify-content-end mb-3">
                        <NavLink to="/add_genre/" className="btn btn-outline-primary">
                            <i className="fas fa-plus"></i> Add Book Genre
                        </NavLink>
                    </div>
                    <div className="card shadow p-4">
                        <form onSubmit={handleSubmit}>
                            <div className="form-group mb-3">
                                <label className="form-label">Title</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group mb-3">
                                <label className="form-label">Author</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="author"
                                    value={formData.author}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group mb-3">
                                <label className="form-label">Book Genre</label>
                                <select
                                    className="form-select"
                                    name="genre"
                                    value={formData.genre}
                                    onChange={handleInputChange}
                                    required
                                >
                                    {formData.genre === '' && <option value="">Select a genre</option>}
                                    {genre.map((gen) => (
                                        <option key={gen.id} value={gen.id}>
                                            {gen.name}
                                        </option>
                                    ))}
                                </select>
                                

                            </div>
                            <div className="form-group mb-3">
                                <label className="form-label">Description</label>
                                <textarea
                                    className="form-control"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows="4"
                                    required
                                ></textarea>
                            </div>
                            <div className="form-group mb-3">
                                <label className="form-label">Book Price (₹)</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group mb-3">
                                <label className="form-label">Book Image</label>
                                <input
                                    type="file"
                                    className="form-control"
                                    name="book_image"
                                    onChange={handleInputChange}
                                />
                            </div>
                            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                                {loading ? (
                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                ) : (
                                    isEdit ? 'Update Book' : 'Add Book'
                                )}
                            </button>
                        </form>
                    </div>
                </>
            ) : (
                <div className="alert alert-warning text-center">
                    Only admin users can add or update books!
                </div>
            )}
        </div>
    );
}

export default AddBook;
