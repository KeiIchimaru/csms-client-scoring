/* ************************************************************* *
   *          day (reducer)                          
   ************************************************************* */
  import { getResponceError } from "../../../../lib/ulib";
  import {
    DAY_REQUEST,
    DAY_SUCCESS,
    DAY_FAILURE
  } from "../../../actions/actionTypes"
  
  const initialState = {
    isFetching: false,
    day: null,
    error: null
  }

  const day = (state = initialState, action) => {
    switch (action.type) {
      case DAY_REQUEST: {
        // 連想配列{}においてキーが重複していた場合は、後のデータで上書きされるという仕様を利用しています。
        return {
          ...initialState,
          isFetching: true
        };
      }
      case DAY_SUCCESS: {
        return {
            ...initialState,
            day: action.data.day
          };
      }
      case DAY_FAILURE: {
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
    
  export default day;
  