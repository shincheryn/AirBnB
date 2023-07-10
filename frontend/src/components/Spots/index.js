import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { fetchSpots } from '../../store/spots';
import './spots.css';

function Spots() {
  const dispatch = useDispatch();
  const spots = useSelector((state) => state.spots.all);
  const history = useHistory();

  useEffect(() => {
    dispatch(fetchSpots());
  }, [dispatch]);

  const handleSpotClick = (spotId) => {
    history.push(`/spots/${spotId}`);
  };

  return (
    <div>
      <div className="spot-list">
        {spots.map((spot) => (
          <div
            key={spot.id}
            className="spot"
            data-tooltip={spot.name}
            onClick={() => handleSpotClick(spot.id)}
          >
            <div
              className="spot-image"
              style={{ backgroundImage: `url(${spot.image})` }}
            ></div>
            <div className="spot-details">
              <div className="spot-location">{`${spot.city}, ${spot.state}`}</div>
              <div className="spot-rating">
                {spot.avgRating !== null ? spot.avgRating : 'NEW'}
              </div>
              <div className="spot-price">${spot.price} / night</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Spots;
