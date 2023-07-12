import { csrfFetch } from './csrf';

// Action Types
const GET_REVIEWS = 'reviews/getReviews';

// Action Creators
const getReviews = (reviews) => ({
  type: GET_REVIEWS,
  reviews,
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
  dispatch(getReviews(data.Reviews));
  return res;
};

// Reviews Reducer
const reviewsReducer = (state = {}, action) => {
    const newState = {...state}
    switch (action.type) {
      case GET_REVIEWS:
        action.reviews.forEach((review) => {
            newState[review.id] = review
          })
        return newState;
      default:
        return state;
    }
  };

  export default reviewsReducer;
