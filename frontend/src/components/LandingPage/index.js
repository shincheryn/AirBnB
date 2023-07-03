import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as spotActions from '../../store/spots';
import './LandingPage.css';

function LandingPage() {
  const dispatch = useDispatch();
  const spots = useSelector((state) => state.spots.all);

  useEffect(() => {
    dispatch(spotActions.fetchSpots());
  }, [dispatch]);

  return (
    <div>
      <h1>Welcome to the Landing Page</h1>
      <ul>
        {Object.values(spots).map((spot) => (
          <li key={spot.id}>
            <h3>{spot.name}</h3>
            <p>{spot.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default LandingPage;
