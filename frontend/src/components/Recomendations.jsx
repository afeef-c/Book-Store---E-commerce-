import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import api from '../services/api';
import { NavLink } from 'react-router-dom';

function Recomendations() {

    const user = useSelector((state) => state.auth.user);

    const [isAdmin, setIsAdmin] = useState(false);
    const [isBuyer, setIsBuyer] = useState(false);
    const [rec, setRec] = useState([])
    
    const fetchReco = async () => {
       
        try {
            
            const response = await api.get('/api/books/recommendations/');
          setRec(response.data);
        } catch (error) {
          console.error("Search failed:", error);
        }
      };
    

  useEffect(() => {
    fetchReco()
    if (user) {
      if (user.is_staff) {
        setIsAdmin(true);
      } else {
        setIsBuyer(true);
      }
    
    }
    },[user])
    console.log("Recomendations: ",rec)
  return (
    <>
    <div className="container mt-4">
      <h3></h3>
      <h2 className="text-center mb-4">Recomendations For You</h2>
      
      {rec.length > 0 ? (
    

        <div className="row">
        {rec.map((book) => (
            <div className="col-md-4 mb-4" key={book.id}>
                <div className="card h-100">
                    <img
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
                </div>
            </div>
        ))}
        </div>
        
      ) : (
        <div className="alert alert-warning">
        <p className='text-warning'>No recommendations for you.</p>
        </div>
      )}
    </div>
    </>
  )
}

export default Recomendations