// spotsReducer.js
import { csrfFetch } from './csrf';

// Action Types
const GET_SPOT_DETAIL = 'spots/getSpotDetail';
const ALL_SPOTS = 'spots/allSpots';

// Action Creators
const spotDetail = (spot) => ({
  type: GET_SPOT_DETAIL,
  spot,
});

const allSpots = (spots) => ({
  type: ALL_SPOTS,
  spots,
});

// Thunks
export const getSpotDetail = (spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}`, {
    method: 'GET',
  });
  const data = await res.json();
  dispatch(spotDetail(data));
  return res;
};

export const fetchSpots = () => async (dispatch) => {
  const res = await csrfFetch('/api/spots', {
    method: 'GET',
  });
  const data = await res.json();
  dispatch(allSpots(data.Spots));
  return res;
};

const initialState = {
  detail: {},
  all: [],
};

const spotsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_SPOT_DETAIL:
      return {
        ...state,
        detail: action.spot,
      };
    case ALL_SPOTS:
      return {
        ...state,
        all: action.spots,
      };
    default:
      return state;
  }
};

export default spotsReducer;
