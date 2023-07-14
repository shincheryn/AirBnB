import React, { useEffect, useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getSpotDetail } from '../../store/spots';
import { fetchReviews, deleteReview, createReview, clearReviews } from '../../store/reviews';
import { ModalContext } from '../../context/Modal';
import CreateReviewModal from '../CreateReviewModal';
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

  const { setModalContent } = React.useContext(ModalContext);
  const currentUser = useSelector((state) => state.session.user);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [serverError, setServerError] = useState('');

  const closeModal = useCallback(() => {
    setModalContent();
  }, [setModalContent]);

  useEffect(() => {
    dispatch(getSpotDetail(id));
    dispatch(fetchReviews(id));

    return () => {
      dispatch(clearReviews());
    };
  }, [dispatch, id]);

  const handleReserveClick = () => {
    alert('Feature coming soon');
  };

  const handlePostReview = () => {
    setIsReviewModalOpen(true);
  };

  const handleReviewSubmit = useCallback(
    async (reviewData) => {
      try {
        const response = await dispatch(createReview(reviewData));

        if (response.error) {
          setServerError('Failed to submit the review. Please try again.');
          return;
        }

        closeModal();
      } catch (error) {
        setServerError('Failed to submit the review. Please try again.');
      }
    },
    [dispatch, closeModal]
  );

  const handleDeleteReview = (reviewId) => {
    dispatch(deleteReview(reviewId));
  };

  if (!spot) {
    return <div>Loading...</div>;
  }

  return (
    <div className="spot-detail">
      <h1>{spot.name}</h1>
      {serverError && <div className="error">{serverError}</div>}
      <div className="spot-info">
        <div className="spot-location">
          Location: {spot?.city}, {spot?.state}, {spot?.country}
        </div>
        <div className="spot-images">
          {spot?.SpotImages &&
            spot?.SpotImages.map((image) => (
              <img key={image?.id} src={image?.url} alt="Spot" className="spot-image-lg" />
            ))}
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
                  {review?.User?.firstName ?? 'User'},{' '}
                  {review.updatedAt
                    ? new Date(review.updatedAt).toLocaleDateString('en-US', {
                        month: 'long',
                        year: 'numeric',
                      })
                    : ''}
                </p>
                <p>{review?.review}</p>
                {review?.User?.id === currentUser.id && (
                  <button
                    className="delete-review-button"
                    onClick={() => handleDeleteReview(review.id)}
                  >
                    Delete
                  </button>
                )}
              </div>
            ))
          )}
        </div>
        <div className="post-review-button">
          {!reviews.some((review) => review?.User.id === currentUser.id) && (
            <button onClick={handlePostReview}>Post Your Review</button>
          )}
        </div>
      </div>

      {isReviewModalOpen && (
        <CreateReviewModal
          closeModal={() => setIsReviewModalOpen(false)}
          spotId={id}
          onSubmit={handleReviewSubmit}
        />
      )}
    </div>
  );
}

export default SpotDetail;
