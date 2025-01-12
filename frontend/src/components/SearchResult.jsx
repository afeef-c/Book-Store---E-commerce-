import React from "react";
import { NavLink, useLocation } from "react-router-dom";

function SearchResults() {
  const location = useLocation();
  const results = location.state?.results || [];
  console.log("Search results: ", results);

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Search Results</h2>
      {results.length > 0 ? (
        <div className="row">
          {results.map((book) => (
            <div className="col-md-4 mb-4" key={book.id}>
              <div className="card h-100 shadow-sm border-0">
                <img
                  src={book.book_image || 'https://images.theconversation.com/files/45159/original/rptgtpxd-1396254731.jpg?ixlib=rb-4.1.0&q=45&auto=format&w=754&fit=clip'}
                  className="card-img-top rounded-top"
                  alt={book.title}
                  style={{ height: "250px", objectFit: "cover" }}
                />
                <div className="card-body">
                  <h5 className="card-title fw-bold text-primary">{book.title}</h5>
                  <p className="card-text mb-1">
                    <strong>Author:</strong> {book.author}
                  </p>
                  <p className="card-text mb-1">
                    <strong>Genre:</strong> {book.genre?.name || "Unknown"}
                  </p>
                  <p className="card-text text-success fw-bold">
                    ₹{book.price}
                  </p>
                </div>
                <div className="card-footer bg-transparent border-0 text-center">
                  <NavLink to={`/book_details/${book.id}`} className="btn btn-outline-primary w-75">
                    View Details
                  </NavLink>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center mt-5">
          <h4 className="text-muted">No results found.</h4>
          <NavLink to="/" className="btn btn-outline-secondary mt-3">
            Back to Home
          </NavLink>
        </div>
      )}
    </div>
  );
}

export default SearchResults;
