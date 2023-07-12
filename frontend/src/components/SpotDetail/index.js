import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getSpotDetail } from '../../store/spots';
import { fetchReviews } from '../../store/reviews';
import './SpotDetail.css';

function SpotDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const spot = useSelector((state) => state.spots[id]);
  const reviews = useSelector((state) =>
    Object.values(state.reviews).filter((review) => review.spotId === parseInt(id))
  );
  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? reviews.reduce((sum, review) => sum + review.stars, 0) / totalReviews
      : 0;

  useEffect(() => {
    dispatch(getSpotDetail(id));
    dispatch(fetchReviews(id));
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
          <div className="spot-image-lg">
          {spot?.Image}
          </div>
        </div>
        <div className="spot-host">
          Hosted by {spot?.Owner?.firstName} {spot?.Owner?.lastName}
        </div>
        <p className="spot-description">{spot?.description}</p>
        <div className="spot-callout">
          <div className="spot-callout-price">${spot?.price} / night</div>
          <div className="spot-callout-rating">
            <i className="fa-solid fa-star"></i> Rating: {averageRating.toFixed(2)}
          </div>
          <div className="spot-callout-reviews">Reviews: {totalReviews}</div>
          <button className="reserve-button" onClick={handleReserveClick}>
            Reserve
          </button>
        </div>

        <div className="reviews-container">
          <h2>Reviews</h2>
          {reviews.length === 0 ? (
            <p>Be the first to post a review!</p>
          ) : (
            reviews.map((review) => (
              <div key={review?.id} className="review">
                <p>
                  {review?.user && review.user?.firstName ? review.user.firstName : 'User'},{' '}
                  {review?.createdAt
                    ? new Date(review?.createdAt).toLocaleDateString('en-US', {
                        month: 'long',
                        year: 'numeric',
                      })
                    : ''}
                </p>
                <p>{review?.review}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default SpotDetail;
