import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {  fetchBooks } from '../features/bookSlice';
import Recomendations from '../components/Recomendations';

function Home() {
  const dispatch = useDispatch();
  
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

      <Recomendations/>

    </div>
  );
}

export default Home;
