import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchSpots } from '../../store/spots';
import './LandingPage.css';

function LandingPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchSpots());
  }, [dispatch]);

  return (
    <div>
      <h1>welcome to airbnb</h1>
    </div>
  );
}

export default LandingPage;
