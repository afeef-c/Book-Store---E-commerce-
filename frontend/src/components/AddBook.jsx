import  { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { fetchUserDetails } from '../features/authSlice';
import api from '../services/api';
import { toast } from 'react-toastify';

function AddBook() {
    const dispatch = useDispatch();
    const user = useSelector(state => state.auth.user);
    const authTokens = useSelector(state => state.auth.authTokens);
    const navigate = useNavigate();
    const [genre, setGenre] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);

    

    useEffect(()=>{
        if (authTokens) {
            dispatch(fetchUserDetails());
        }
        
        if (user){
            if(user.is_staff){
                setIsAdmin(true)
            }
        }
    },[authTokens, dispatch, navigate, user])

    
    
    console.log("user",user)
    
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        genre: '',
        author:'',
        price: 0.00,
        book_image: null,
    });

    const [loading, setLoading] = useState(false);


    useEffect(() => {
        const fetchGenre = async () => {
            try {
                const response = await api.get('/api/books/genre/', {
                    headers: {
                        Authorization: `Bearer ${authTokens.access}`,
                    },
                });
                setGenre(response.data);
            } catch (error) {
                console.error('Error fetching categories:', error.response ? error.response.data : error);
                toast.error('Error fetching categories');
            }
        };

        if (isAdmin) {
            fetchGenre();
        }
        
    }, [authTokens.access, dispatch, isAdmin]);

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
                if (formData.image) {
                    data.append('book_image', formData.book_image);
                }

                await api.post('/api/books/', data, {
                    headers: {
                        Authorization: `Bearer ${authTokens.access}`,
                        'Content-Type': 'multipart/form-data',
                    },
                });

                toast.success('Book added to list successfully');
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
                toast.error('Error creating course');
            } finally {
                setLoading(false);
            }
        } else {
            toast.warn("Only  admins can add new books");
            navigate('/');
        }
    };

    return (
        <div className="container">
            <h2>Add Course</h2>
            {( isAdmin) ? 
            (
            <>
                <div className="card-header-action">
                    <NavLink to="/add_genre/" className="nav-item nav-link" >
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
                            value={formData.genre}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Select a genre</option>
                            {genre.map(gen => (
                                <option key={gen.id} value={gen.id}>{gen.name}</option>
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
                        {loading ? 'Adding...' : 'Add Book'}
                    </button>
                </form>
            </>):
            (<>
                
                <>
                    <p className='text-warning'> Only admin user can add new books !! </p>
                    
                </>    
                
            </>)}
        </div>
    );
}

export default AddBook;
