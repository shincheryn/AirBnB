import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMySpots } from '../../store/spots';
import './ManageSpots.css';

function ManageSpots() {
  const dispatch = useDispatch();
  let spots = useSelector((state) => state?.spots?.mySpots);
  if (spots) spots = Object.values(spots);

  useEffect(() => {
    dispatch(fetchMySpots());
  }, [dispatch]);

  // Check if the user has any spots
  if (!spots || spots.length === 0) {
    return (
      <div>
        <h2>Manage Spots</h2>
        <p>No spots found. <Link to="/spots/new">Create a New Spot</Link></p>
      </div>
    );
  }

  return (
    <div>
      <h2>Manage Spots</h2>
      <div className="spot-container">
        {spots.map((spot) => (
          <Link to={`/spots/${spot?.id}`} key={spot?.id} className="spot-tile-link">
            <div className="spot-tile">
              <div className="spot-image">
                {spot?.Image}
              </div>
              <div className="spot-info">
                <h3>{spot?.name}</h3>
                <p>Price: ${spot?.price}</p>
              </div>
              <div className="spot-buttons">
                <button className="spot-button">Update</button>
                <button className="spot-button">Delete</button>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <Link to="/spots/new" className="create-spot-link">Create a New Spot</Link>
    </div>
  );
}

export default ManageSpots;
