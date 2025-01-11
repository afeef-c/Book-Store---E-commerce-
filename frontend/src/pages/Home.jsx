import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {  fetchBooks } from '../features/bookSlice';

function Home() {
  const dispatch = useDispatch();
  const { book_list , status, error } = useSelector((state) => state.books.book_list);
  const newBooks= book_list
  const mostLikedBooks= book_list
  
  useEffect(() => {
    dispatch(fetchBooks())
  }, [dispatch]);

  return (
    <div className="home">
      {/* Hero Section */}
      <div className="hero-section" style={{ position: 'relative', textAlign: 'center', color: 'white' }}>
        <img
          src="https://plus.unsplash.com/premium_photo-1681488394409-5614ef55488c?q=80&w=1664&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Books Store"
          style={{ width: '100%', objectFit: 'cover' }}
        />
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            padding: '20px',
            borderRadius: '10px',
          }}
        >
          <h1>Welcome to Books Store</h1>
          <p>Discover your next great read!</p>
        </div>
      </div>

      {/* Newly Added Books */}
      <div className="new-books container my-5">
        <h2 className="text-center mb-4">Newly Added Books</h2>
        {status === 'loading' ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-danger">{error}</p>
        ) : (
          <div className="row">
            {newBooks?.map((book) => (
              <div className="col-md-3 mb-4" key={book.id}>
                <div className="card h-100">
                  <img
                    src={book.coverImage || 'https://via.placeholder.com/150'}
                    alt={book.title}
                    className="card-img-top"
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{book.title}</h5>
                    <p className="card-text">{book.author}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Most Liked Books */}
      <div className="most-liked-books container my-5">
        <h2 className="text-center mb-4">Most Liked Books</h2>
        {status === 'loading' ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-danger">{error}</p>
        ) : (
          <div className="row">
            {mostLikedBooks?.map((book) => (
              <div className="col-md-3 mb-4" key={book.id}>
                <div className="card h-100">
                  <img
                    src={book.coverImage || 'https://via.placeholder.com/150'}
                    alt={book.title}
                    className="card-img-top"
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{book.title}</h5>
                    <p className="card-text">{book.author}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
