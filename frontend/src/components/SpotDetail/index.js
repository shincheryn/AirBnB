import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getSpotDetail } from './store/spots';

function SpotDetails() {
  const dispatch = useDispatch();
  const { spotId } = useParams();
  const spot = useSelector(selectSpotById(spotId));

  useEffect(() => {
    dispatch(getSpotDetail(spotId));
  }, [dispatch, spotId]);

  if (!spot) {
    return <div>Loading spot details...</div>;
  }

  return (
    <div className="spot-details">
      <h2>{spot.name}</h2>
      <div>
        <img src={spot.thumbnail} alt={spot.name} className="spot-thumbnail" />
        <div>
          <p>{spot.city}, {spot.state}</p>
          <p>Rating: {spot.rating || 'New'}</p>
          <p>Price per night: ${spot.price.toFixed(2)}</p>
        </div>
      </div>

    </div>
  );
}

export default SpotDetails;
