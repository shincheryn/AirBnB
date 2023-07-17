import { csrfFetch } from "./csrf";

// Action Types
const MY_SPOTS = "spots/mySpots";

const mySpots = (spots) => ({
  type: MY_SPOTS,
  spots,
});

export const fetchMySpots = () => async (dispatch) => {
  const res = await csrfFetch("/api/users/spots", {
    method: "GET",
  });
  const data = await res.json();
  dispatch(mySpots(data.Spots));
  return res;
};

// Spots Reducer
const mySpotsReducer = (state = {}, action) => {
  const newState = { ...state };
  switch (action.type) {
    case MY_SPOTS:
      action.spots.forEach((spot) => {
        newState[spot.id] = spot;
      });
      return newState;

    default:
      return state;
  }
};

export default mySpotsReducer;
