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

  const handleReserveClick = () => {
    alert('Feature coming soon');
  };

  return (
    <div className="spot-detail">
      <h1>{spot?.name}</h1>
      <div className="spot-info">
        <div className="spot-location">
          Location: {spot?.city}, {spot?.state}, {spot?.country}
        </div>
        <div className="spot-images">
          <div className="spot-image-lg"></div>
          <div className="spot-image-container">
            <div className="spot-image-sm"></div>
            <div className="spot-image-sm"></div>
            <div className="spot-image-sm"></div>
            <div className="spot-image-sm"></div>
          </div>
        </div>
        <div className="spot-host">
          Hosted by {spot?.firstName} {spot?.lastName}
        </div>
        <p className="spot-description">{spot?.description}</p>
        <div className="spot-callout">
          <div className="spot-callout-price">
            ${spot?.price} / night
          </div>
          <div className="spot-callout-rating">
          <i class="fa-solid fa-star"></i>
            Rating: {spot?.avgRating !== null ? spot?.avgRating : 'Not rated'}
          </div>
          <div className="spot-callout-reviews">
            Reviews: {spot?.reviewCount || 0}
          </div>
          <button
            className="reserve-button"
            onClick={handleReserveClick}
          >
            Reserve
          </button>
        </div>
      </div>
    </div>
  );
}

export default SpotDetail;
