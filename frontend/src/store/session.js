import { csrfFetch } from "./csrf";

const SET_USER = "session/setUser";
const REMOVE_USER = "session/removeUser";

//Set User
const setUser = (user) => {
  if (user) {
    return {
      type: SET_USER,
      payload: {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      },
    };
  } else {
    return {
      type: SET_USER,
      payload: {
        user: null,
      },
    };
  };
  }

//Remove User
const removeUser = () => {
  return {
    type: REMOVE_USER,
  };
};

const initialState = { user: null };

//Sign Up
export const signup = (user) => async (dispatch) => {
  const { username, firstName, lastName, email, password } = user;
  const response = await csrfFetch("/api/users", {
    method: "POST",
    body: JSON.stringify({
      username,
      firstName,
      lastName,
      email,
      password,
    }),
  });
  const data = await response.json();
  dispatch(setUser(data.user));
  return response;
};

//Log In User
export const login = (user) => async (dispatch) => {
  const { credential, password } = user;
  const response = await csrfFetch("/api/session", {
    method: "POST",
    body: JSON.stringify({
      credential,
      password,
    }),
  });
  const data = await response.json();
  dispatch(setUser(data.user));
  return response;
};

//Log Out User
export const logout = () => async (dispatch) => {
  const response = await csrfFetch('/api/session', {
    method: 'DELETE',
  });

  if (response.ok) {
    dispatch(removeUser());
  }
};

//Restore User
export const restoreUser = () => async (dispatch) => {
  const response = await csrfFetch('/api/session');
  const data = await response.json();
  dispatch(setUser(data.user));
  return response;
};

//Session Reducer
const sessionReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case SET_USER:
      newState = {
        ...state,
        user: action.payload.user,
      };
      return newState;
    case REMOVE_USER:
      newState = {
        ...state,
        user: null,
      };
      return newState;
    default:
      return state;
  }
};

export default sessionReducer;
