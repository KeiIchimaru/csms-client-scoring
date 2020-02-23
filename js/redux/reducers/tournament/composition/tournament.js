/* ************************************************************* *
   *          tournamentEvent (reducer)                          
   ************************************************************* */
  import { getResponceError } from "../../../../lib/ulib";
  import {
    TOURNAMENT_REQUEST,
    TOURNAMENT_SUCCESS,
    TOURNAMENT_FAILURE
  } from "../../../actions/actionTypes";
  
  const initialState = {
    isFetching: false,
    error: null
  }
  
  const tournament = (state = initialState, action) => {
    switch (action.type) {
      case TOURNAMENT_REQUEST: {
        return { ...state, isFetching: true };
      }
      case TOURNAMENT_SUCCESS: {
        return { ...state, ...action.data, isFetching: false };
      }
      case TOURNAMENT_FAILURE: {
        let error = getResponceError(action.error.response);
        return { ...state, error };
      }
      default: {
        return state;
      }
    }
  };
  
  export default tournament;