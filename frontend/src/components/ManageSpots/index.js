import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMySpots } from '../../store/spots';
import { deleteReview } from '../../store/reviews'; // Import deleteReview from the correct path
import ConfirmationModal from './ConfirmationModal';
import './ManageSpots.css';

function ManageSpots() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [selectedReview, setSelectedReview] = useState(null);
  let spots = useSelector((state) => state?.spots?.mySpots);
  if (spots) spots = Object.values(spots);

  useEffect(() => {
    dispatch(fetchMySpots());
  }, [dispatch]);

  const handleUpdateSpot = (spotId) => {
    history.push(`/spots/${spotId}/update`);
  };

  const handleDeleteReview = (reviewId) => {
    setSelectedReview(reviewId);
  };

  const handleConfirmationModalAction = (confirmed) => {
    if (confirmed && selectedReview) {
      dispatch(deleteReview(selectedReview)); // Dispatch the deleteReview action with the selectedReview
    }
    setSelectedReview(null);
  };

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
          <div key={spot?.id} className="spot-tile">
            <Link to={`/spots/${spot?.id}`} className="spot-tile-link">
              <div className="spot-image">
                {spot?.Image}
              </div>
              <div className="spot-info">
                <h3>{spot?.name}</h3>
                <p>Price: ${spot?.price}</p>
              </div>
            </Link>
            <div className="spot-buttons">
              <button className="spot-button" onClick={() => handleUpdateSpot(spot?.id)}>
                Update
              </button>
              <button className="spot-button" onClick={() => handleDeleteReview(spot?.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      <Link to="/spots/new" className="create-spot-link">Create a New Spot</Link>

      {selectedReview && (
        <ConfirmationModal
          title="Confirm Delete"
          message="Are you sure you want to delete this review?"
          onAction={handleConfirmationModalAction}
        />
      )}
    </div>
  );
}

export default ManageSpots;
