import React from "react";
import { NavLink, useLocation } from "react-router-dom";

function SearchResults() {
  const location = useLocation();
  const results = location.state?.results || [];
     console.log("Serach results: ",results)
  return (
    <div className="container mt-4">
      <h3>Search Results</h3>
      {results.length > 0 ? (
        <>
        <ul className="list-group">
          {results.map((book) => (
            <li key={book.id} className="list-group-item">
              {book.title}
            </li>
          ))}
        </ul>

        <div className="row">
        {results.map((book) => (
            <div className="col-md-4 mb-4" key={book.id}>
                <div className="card h-100">
                    <img
                        src={`${import.meta.env.VITE_API_URL}${book.book_image}` || 'https://images.theconversation.com/files/45159/original/rptgtpxd-1396254731.jpg?ixlib=rb-4.1.0&q=45&auto=format&w=754&fit=clip'}

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
                    {/* {isAdmin?
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
                    } */}
                </div>
            </div>
        ))}
        </div>
        </>
      ) : (
        <p>No results found.</p>
      )}
    </div>
  );
}

export default SearchResults;
