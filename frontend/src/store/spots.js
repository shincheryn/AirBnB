import { csrfFetch } from "./csrf";

// Action Types
const GET_SPOT_DETAIL = "spots/getSpotDetail";
const ALL_SPOTS = "spots/allSpots";

// Selectors
export const selectSpotById = (spotId) => (state) => state.spots.all[spotId];

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
    method: "GET",
  });
  const data = await res.json();
  dispatch(spotDetail(data));
  return res;
};

export const fetchSpots = () => async (dispatch) => {
  const res = await csrfFetch("/api/spots", {
    method: "GET",
  });
  const data = await res.json();
  dispatch(allSpots(data));
  return res;
};

const initialState = {
  detail: {},
  all: {},
};
//get rid of this and make state = initialState an empty array

const spotsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_SPOT_DETAIL:
      // Update the spot detail in the state
      return {
        ...state,
        detail: action.spot,
      };
    case ALL_SPOTS:
      // Update the list of all spots in the state
      return {
        ...state,
        all: { ...state.all, ...action.spots },
      };
    default:
      return state;
  }
};

export default spotsReducer;
