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
    </div>
  );
}

export default LandingPage;
