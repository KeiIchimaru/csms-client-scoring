/* ************************************************************* *
   *          tournamentEventAction                             
   ************************************************************* */
import axios from 'axios';
import {
  TOURNAMENT_EVENT_REQUEST,
  TOURNAMENT_EVENT_SUCCESS,
  TOURNAMENT_EVENT_FAILURE
} from "../../actionTypes";

// tournamentEvent
const tournamentEventRequestAction = () => ({
  type: TOURNAMENT_EVENT_REQUEST,
});

const tournamentEventSuccessAction = data => ({  
  type: TOURNAMENT_EVENT_SUCCESS,
  data
});
const tournamentEventFailureAction = error => ({
  type: TOURNAMENT_EVENT_FAILURE,
  error
});

export const tournamentEventAction = () => {
  return (dispatch) => {
    dispatch(tournamentEventRequestAction())
    return axios.get('/api/tournament/composition/tournamentEvent')
      .then(res =>
        dispatch(tournamentEventSuccessAction(res.data))
      ).catch(err =>
        dispatch(tournamentEventFailureAction(err))
      )
  }
};
