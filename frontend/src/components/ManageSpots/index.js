import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMySpots, deleteSpot } from '../../store/spots';
import ConfirmationModal from './ConfirmationModal';
import './ManageSpots.css';

function ManageSpots() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [selectedSpot, setSelectedSpot] = useState(null);
  let spots = useSelector((state) => state?.spots?.mySpots);
  if (spots) spots = Object.values(spots);

  useEffect(() => {
    dispatch(fetchMySpots());
  }, [dispatch]);

  const handleUpdateSpot = (spotId) => {
    history.push(`/spots/${spotId}/update`);
  };

  const handleDeleteSpot = (spotId) => {
    setSelectedSpot(spotId);
  };

  const handleConfirmationModalAction = (confirmed) => {
    if (confirmed && selectedSpot) {
      dispatch(deleteSpot(selectedSpot))
        .then(() => {
          window.location.reload(); // Refresh the page
        })
        .catch((error) => {
          console.error('Spot deletion failed:', error);
        });
    }
    setSelectedSpot(null);
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
              <button className="spot-button" onClick={() => handleDeleteSpot(spot?.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      <Link to="/spots/new" className="create-spot-link">Create a New Spot</Link>

      {selectedSpot && (
        <ConfirmationModal
          title="Confirm Delete"
          message="Are you sure you want to delete this spot?"
          onAction={handleConfirmationModalAction}
        />
      )}
    </div>
  );
}

export default ManageSpots;
