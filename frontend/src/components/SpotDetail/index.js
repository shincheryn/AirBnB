import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getSpotDetail } from '../../store/spots';
import './SpotDetail.css';

function SpotDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const spot = useSelector((state) => state.spots.detail);

  useEffect(() => {
    dispatch(getSpotDetail(id));
  }, [dispatch, id]);

  return (
    <div className="spot-detail">
      <h1>{spot.name}</h1>
      <p>{spot.description}</p>
      <div className="spot-details">
        <div className="spot-location">
          Location: {spot.city}, {spot.state}, {spot.country}
        </div>
        <div className="spot-rating">Rating: {spot.avgRating !== null ? spot.avgRating : 'Not rated'}</div>
        <div className="spot-price">${spot.price} / night</div>
      </div>
    </div>
  );
}

export default SpotDetail;
