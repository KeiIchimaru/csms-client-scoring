/* ************************************************************* *
   *          tournamentAction                             
   ************************************************************* */
  import axios from 'axios';
  import {
    TOURNAMENT_REQUEST,
    TOURNAMENT_SUCCESS,
    TOURNAMENT_FAILURE
  } from "../../actionTypes";
  
  // tournament
  const tournamentRequestAction = () => ({
    type: TOURNAMENT_REQUEST,
  });
  
  const tournamentSuccessAction = data => ({  
    type: TOURNAMENT_SUCCESS,
    data
  });
  const tournamentFailureAction = error => ({
    type: TOURNAMENT_FAILURE,
    error
  });
  
  export const tournamentAction = () => {
    return (dispatch) => {
      dispatch(tournamentRequestAction())
      return axios.get('/api/tournament/composition/tournament')
        .then(res =>
          dispatch(tournamentSuccessAction(res.data))
        ).catch(err =>
          dispatch(tournamentFailureAction(err))
        )
    }
  };
  