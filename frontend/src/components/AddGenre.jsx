import  { useState } from 'react';
import api from '../services/api';
import {useNavigate} from 'react-router-dom';
import { toast } from 'react-toastify';


function AddGenre() {
    const [formData, setFormData] = useState({ name: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate()

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const data = new FormData();
            data.append('name', formData.name);
            

            await api.post('/api/books/genre/', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            toast.success("Genre created successfully")
            setFormData({ name: ''});
        } catch (error) {
            setError(error.response ? error.response.data : 'Error creating category');
        } finally {
            setLoading(false);
            navigate('/')
        }
    };

    return (
        <div className="container">
            <h2>Add Genre</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Name</label>
                    <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Creating...' : 'Add New Genre'}
                </button>
                {error && <p className="text-danger">{error}</p>}
            </form>
        </div>
    );
}

export default AddGenre;
