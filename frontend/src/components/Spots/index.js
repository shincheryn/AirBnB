import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { fetchSpots } from '../../store/spots';
import './spots.css';

function Spots() {
  const dispatch = useDispatch();
  let spots = useSelector((state) => state.spots);
  const history = useHistory();
  spots = Object.entries(spots).filter(([key]) => key !== 'detail');

  useEffect(() => {
    dispatch(fetchSpots());
  }, [dispatch]);

  const handleSpotClick = (spotId) => {
    history.push(`/spots/${spotId}`);
  };

  return (
    <div>
      <div className="spot-list">
        {spots.map(([key, spot]) => (
          <div
            key={spot?.id}
            className="spot"
            data-tooltip={spot?.name}
            onClick={() => handleSpotClick(spot?.id)}
          >
            <div
              className="spot-image"
              style={{ backgroundImage: `url(${spot?.image})` }}
            ></div>
            <div className="spot-details">
              <div className="spot-location">{`${spot?.city}, ${spot?.state}`}</div>
              <div className="spot-rating">
                {spot?.avgRating !== undefined && spot?.avgRating !== null ? (
                  <>
                    <i className="fa-solid fa-star star-icon"></i>
                    {spot?.avgRating.toFixed(1)}
                  </>
                ) : (
                  <span>NEW</span>
                )}
              </div>
              <div className="spot-price">${spot?.price} / night</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Spots;
