import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { fetchUserDetails } from '../features/authSlice';
import { fetchBookDetails, fetchBooks, fetchGenre } from "../features/bookSlice";
import api from '../services/api';
import { toast } from 'react-toastify';

function AddBook() {
    const dispatch = useDispatch();
    const user = useSelector(state => state.auth.user);
    const authTokens = useSelector(state => state.auth.authTokens);
    const navigate = useNavigate();
    const { bookId } = useParams();
    const { genre, bookDetails,gen_status, details_status } = useSelector((state) => state.books);
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
        if (gen_status=='idle'){
            dispatch(fetchGenre())
        }

        if (user?.is_staff) {
            setIsAdmin(true);
        }
    }, [authTokens, dispatch, user,gen_status]);

    useEffect(() => {
        if (bookId) {
            setIsEdit(true);
            dispatch(fetchGenre());
            dispatch(fetchBookDetails(bookId));
        }
            
    }, [bookId, dispatch]);

    useEffect(() => {
        if (isEdit && details_status === 'succeeded' && bookDetails) {
            setFormData({
                title: bookDetails.title || '',
                description: bookDetails.description || '',
                genre: bookDetails.genre || '',
                author: bookDetails.author || '',
                price: bookDetails.price || 0.00,
                book_image: null,
            });
        }
    }, [isEdit, details_status, bookDetails]);

    const handleInputChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value,
        }));
    };

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
                if (formData.book_image) {
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
                navigate('/');
            } catch (error) {
                toast.error('Error saving book');
            } finally {
                setLoading(false);
            }
        } else {
            toast.warn("Only admins can add or update books");
            navigate('/');
        }
    };

    return (
        <div className="container">
            <h2>{isEdit ? 'Update Book' : 'Add Book'}</h2>
            {isAdmin ? (
                <>
                    <div className="card-header-action">
                        <NavLink to="/add_genre/" className="nav-item nav-link">
                            <i className="fas fa-book"></i> Add Book Genre
                        </NavLink>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Title</label>
                            <input
                                type="text"
                                className="form-control"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Author</label>
                            <input
                                type="text"
                                className="form-control"
                                name="author"
                                value={formData.author}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Book Genre</label>
                            <select
                                className="form-control"
                                name="genre"
                                value={formData.genre} // Set to the current genre ID
                                onChange={handleInputChange}
                                required
                            >
                                {formData.genre === '' && <option value="">Select a genre</option>} {/* Show only when no genre is selected */}
                                {genre.map(gen => (
                                    <option key={gen.id} value={gen.id}>
                                        {gen.name}
                                    </option>
                                ))}
                            </select>
                        </div>


                        <div className="form-group">
                            <label>Description</label>
                            <textarea
                                className="form-control"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Book Price</label>
                            <input
                                type="number"
                                className="form-control"
                                name="price"
                                value={formData.price}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Book Image</label>
                            <input
                                type="file"
                                className="form-control"
                                name="book_image"
                                onChange={handleInputChange}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? (isEdit ? 'Updating...' : 'Adding...') : (isEdit ? 'Update Book' : 'Add Book')}
                        </button>
                    </form>
                </>
            ) : (
                <p className='text-warning'>Only admin users can add or update books!</p>
            )}
        </div>
    );
}

export default AddBook;
