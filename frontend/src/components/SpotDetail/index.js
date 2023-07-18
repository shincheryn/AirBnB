import React, { useEffect, useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getSpotDetail } from "../../store/spots";
import { fetchReviews, deleteReview, createReview } from "../../store/reviews";
import CreateReviewModal from "../CreateReviewModal";
import DeleteModal from "../CreateReviewModal/DeleteModal";
import "./SpotDetail.css";

function SpotDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const spot = useSelector((state) => state.spots[id]);
  const reviews = useSelector((state) =>
    Object.values(state.reviews).filter(
      (review) => review.spotId === parseInt(id)
    )
  );
  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? reviews.reduce((sum, review) => sum + review.stars, 0) / totalReviews
      : 0;

  const currentUser = useSelector((state) => state.session.user);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState(null);

  const closeModal = useCallback(() => {
    setIsReviewModalOpen(false);
  }, []);

  useEffect(() => {
    dispatch(getSpotDetail(id));
    dispatch(fetchReviews(id));
  }, [dispatch, id]);

  const handleReserveClick = () => {
    alert("Feature coming soon");
  };

  const handlePostReview = () => {
    setIsReviewModalOpen(true);
  };

  const handleReviewSubmit = useCallback(
    (reviewData) => {
      dispatch(createReview(reviewData));
      closeModal();
      window.location.reload(); // Refresh the page
    },
    [dispatch, closeModal]
  );

  const handleDeleteReview = (reviewId) => {
    setShowDeleteModal(true);
    setSelectedReviewId(reviewId);
  };

  const handleDeleteConfirmation = (confirmed) => {
    if (confirmed && selectedReviewId) {
      dispatch(deleteReview(selectedReviewId));
    }
    setShowDeleteModal(false);
  };

  if (!spot) {
    return <div>Loading...</div>;
  }

  const hasPostedReview = reviews.some(
    (review) => review?.User?.id === currentUser?.id
  );

  return (
    <div className="spot-detail">
      <h1>{spot.name}</h1>
      <div className="spot-info">
        <div className="spot-location">
          Location: {spot?.city}, {spot?.state}, {spot?.country}
        </div>
        <div className="spot-images">
          {spot?.SpotImages &&
            spot?.SpotImages.map((image) => (
              <img
                key={image?.id}
                src={image?.url}
                alt="Spot"
                className="spot-image-lg"
              />
            ))}
        </div>
        <div className="spot-host">
          Hosted by {spot?.Owner?.firstName} {spot?.Owner?.lastName}
        </div>
        <div className="spot-description-callout-container">
          <p className="spot-description">{spot?.description}</p>
          <div className="spot-callout">
            <div className="spot-callout-price">${spot?.price} / night</div>
            {totalReviews === 0 ? (
              <div>
                <div className="spot-callout-rating">
                  <i className="fa-solid fa-star"></i> NEW
                </div>
                {spot?.Owner?.id !== currentUser?.id && (
                  <p>Be the first to post a review!</p>
                )}
              </div>
            ) : (
              <div>
                <div className="spot-callout-rating">
                  <i className="fa-solid fa-star"></i> Rating:{" "}
                  {averageRating.toFixed(2)}
                </div>
                <div className="spot-callout-reviews">
                  Reviews: {totalReviews}
                </div>
              </div>
            )}

            <button className="reserve-button" onClick={handleReserveClick}>
              Reserve
            </button>
          </div>
        </div>
        <div className="reviews-container">
          {totalReviews === 0 ? (
            <div>
              <i className="fa-solid fa-star"></i> NEW
            </div>
          ) : (
            <div>
              <i className="fa-solid fa-star"></i> {averageRating.toFixed(2)} ·{" "}
              {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
            </div>
          )}

          <div className="post-review-button">
            {!currentUser ||
            hasPostedReview ||
            spot?.Owner?.id === currentUser?.id ? null : (
              <button onClick={handlePostReview}>Post Your Review</button>
            )}
          </div>

          {reviews.length === 0 && spot?.Owner?.id !== currentUser?.id ? (
            <p>Be the first to post a review!</p>
          ) : (
            reviews
              .map((review) => (
                <div key={review?.id} className="review">
                  <p>
                    {review?.User?.firstName ?? "User"},{" "}
                    {review.updatedAt
                      ? new Date(review.updatedAt).toLocaleDateString("en-US", {
                          month: "long",
                          year: "numeric",
                        })
                      : ""}
                  </p>
                  <p>{review?.review}</p>
                  {review?.User?.id === currentUser?.id && (
                    <button
                      className="delete-review-button"
                      onClick={() => handleDeleteReview(review.id)}
                    >
                      Delete Review
                    </button>
                  )}
                </div>
              ))
              .reverse() // Reverse the order of reviews to show the most recent review first
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

      {showDeleteModal && (
        <DeleteModal
          title="Confirm Delete"
          message="Are you sure you want to delete this review?"
          onAction={handleDeleteConfirmation}
        />
      )}
    </div>
  );
}

export default SpotDetail;
