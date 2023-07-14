import { csrfFetch } from './csrf';

// Action Types
const GET_REVIEWS = 'reviews/getReviews';
const POST_REVIEWS = 'reviews/postReviews';
const DELETE_REVIEW = 'reviews/deleteReview';
const CLEAR_REVIEWS = 'reviews/clearReviews';

// Action Creators
const getReviewsAction = (reviews) => ({
  type: GET_REVIEWS,
  reviews,
});

const postReviewAction = (review) => ({
  type: POST_REVIEWS,
  review,
});

const deleteReviewAction = (reviewId) => ({
  type: DELETE_REVIEW,
  reviewId,
});

export const clearReviews = () => ({
  type: CLEAR_REVIEWS,
});

// Thunks
export const fetchReviews = (spotId) => async (dispatch) => {
  if (!spotId) {
    return;
  }

  const res = await csrfFetch(`/api/spots/${spotId}/reviews`, {
    method: 'GET',
  });
  const data = await res.json();
  dispatch(getReviewsAction(data.Reviews));
  return res;
};

export const createReview = (reviewData) => async (dispatch) => {
  try {
    const res = await csrfFetch(`/api/spots/${reviewData.spotId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
    const data = await res.json();
    dispatch(postReviewAction(data));
    return res;
  } catch (error) {
    throw error;
  }
};

export const deleteReview = (reviewId) => async (dispatch) => {
  try {
    const res = await csrfFetch(`/api/reviews/${reviewId}`, {
      method: 'DELETE',
    });
    dispatch(deleteReviewAction(reviewId));
    return res;
  } catch (error) {
    throw error;
  }
};

// Reviews Reducer
const reviewsReducer = (state = {}, action) => {
  const newState = { ...state };
  switch (action.type) {
    case GET_REVIEWS:
      action.reviews.forEach((review) => {
        newState[review.id] = review;
      });
      return newState;
    case POST_REVIEWS:
      newState[action.review.id] = action.review;
      return newState;
    case DELETE_REVIEW:
      delete newState[action.reviewId];
      return newState;
    case CLEAR_REVIEWS:
      return {};
    default:
      return state;
  }
};

export default reviewsReducer;
