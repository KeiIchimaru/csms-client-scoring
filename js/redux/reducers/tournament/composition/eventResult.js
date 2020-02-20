/* ************************************************************* *
   *          eventResult (reducer)                          
   ************************************************************* */
  import { getResponceError } from "../../../../lib/ulib";
  import {
    EVENT_RESULT_REQUEST,
    EVENT_RESULT_SUCCESS,
    EVENT_RESULT_FAILURE
  } from "../../../actions/actionTypes"
  
  const initialState = {
    isFetching: false,
    error: null
  }

  const eventResult = (state = initialState, action) => {
    switch (action.type) {
      case EVENT_RESULT_REQUEST: {
        return {
          ...initialState,
          isFetching: true
        };
      }
      case EVENT_RESULT_SUCCESS: {
        return initialState;
      }
      case EVENT_RESULT_FAILURE: {
        let error = getResponceError(action.error.response);
        // データはクリアする。
        return {
          ...initialState,
          error
        };
      }
      default: {
          return state;
      }
    }
  };
    
  export default eventResult;
  