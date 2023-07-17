import { csrfFetch } from "./csrf";

// Action Types
const GET_SPOT_DETAIL = "spots/getSpotDetail";
const ALL_SPOTS = "spots/allSpots";
const MY_SPOTS = "spots/mySpots";
const DELETE_SPOT = "spots/deleteSpot";
const UPDATE_SPOT = "spots/updateSpot";
const CREATE_IMAGE = "spots/createImage";

// Action Creators
const spotDetail = (spot) => ({
  type: GET_SPOT_DETAIL,
  spot,
});

const allSpots = (spots) => ({
  type: ALL_SPOTS,
  spots,
});

const mySpots = (spots) => ({
  type: MY_SPOTS,
  spots,
});

const deleteSpotAction = (spotId) => ({
  type: DELETE_SPOT,
  spotId,
});

const updateSpotAction = (spot) => ({
  type: UPDATE_SPOT,
  spot,
});

const createSpotImageAction = (spotId, spotImage) => ({
  type: CREATE_IMAGE,
  spotId,
  spotImage,
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
  dispatch(allSpots(data.Spots));
  return res;
};

export const fetchMySpots = () => async (dispatch) => {
  const res = await csrfFetch("/api/users/spots", {
    method: "GET",
  });
  const data = await res.json();
  dispatch(mySpots(data.Spots));
  return res;
};

export const createSpot = (spotData) => async (dispatch) => {
  const res = await csrfFetch("/api/spots", {
    method: "POST",
    body: JSON.stringify(spotData),
  });
  const spot = await res.json();
  return spot;
};

export const createImage = (spotId, imageData) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}/images`, {
    method: "POST",
    body: JSON.stringify(imageData),
  });
  const spotImage = await res.json();
  dispatch(createSpotImageAction(spotId, spotImage));
  return spotImage;
};

export const deleteSpot = (spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    throw new Error("Spot deletion failed");
  }
  dispatch(deleteSpotAction(spotId));
};

export const updateSpot = (spotId, spotData) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}`, {
    method: "PUT",
    body: JSON.stringify(spotData),
  });
  const spot = await res.json();
  dispatch(updateSpotAction(spot));
  return res;
};

// Spots Reducer
const spotsReducer = (state = {}, action) => {
  const newState = { ...state };
  switch (action.type) {
    case GET_SPOT_DETAIL:
      newState[action.spot.id] = action.spot;
      return newState;

    case ALL_SPOTS:
      action.spots.forEach((spot) => {
        newState[spot.id] = spot;
      });
      return newState;

    case MY_SPOTS:
      newState.mySpots = {};
      action.spots.forEach((spot) => {
        newState.mySpots[spot.id] = spot;
      });
      return newState;

    case DELETE_SPOT:
      delete newState[action.spotId];
      return newState;

    case UPDATE_SPOT:
      newState[action.spot.id] = action.spot;
      return newState;

    // case CREATE_IMAGES:
    //   newState[action.spotId].preview = action.spotImages.preview;
    //   newState[action.spotId].url = action.spotImages.url;
    //   return newState;

    default:
      return state;
  }
};

export default spotsReducer;
