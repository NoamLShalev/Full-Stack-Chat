import { createStore } from "redux";

let reducer = (state, action) => {
  if (action.type === "login-success") {
    return { ...state, loggedIn: true };
  }
  if (action.type === "login-failure") {
    return { ...state, loggedIn: false };
  }
  if (action.type === "set-messages") {
    return { ...state, msgs: action.messages, users: action.users };
  }
  if (action.type === "loaded") {
    return { ...state, loading: false };
  }
  if (action.type === "admin") {
    return { ...state, admin: true };
  }
  if (action.type === "admin-false") {
    return { ...state, admin: false };
  }
  return state;
};

let store = createStore(
  reducer,
  { msgs: [], loggedIn: false, loading: true, users: [], admin: false },
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;
