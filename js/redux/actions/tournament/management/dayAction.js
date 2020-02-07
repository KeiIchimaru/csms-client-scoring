/* ************************************************************* *
   *          dayAction                             
   ************************************************************* */
  import axios from 'axios';
  import {
    DAY_REQUEST,
    DAY_SUCCESS,
    DAY_FAILURE
  } from "../../actionTypes";
  
  // day
  const dayRequestAction = () => ({
    type: DAY_REQUEST,
  });
  
  const daySuccessAction = data => ({  
    type: DAY_SUCCESS,
    data
  });
  const dayFailureAction = error => ({
    type: DAY_FAILURE,
    error
  });
  
  export const dayAction = () => {
    return (dispatch) => {
      dispatch(dayRequestAction())
      return axios.get('/api/tournament/management/day')
        .then(res =>
          dispatch(daySuccessAction(res.data))
        ).catch(err =>
          dispatch(dayFailureAction(err))
        )
    }
  };
  