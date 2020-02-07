/* ************************************************************* *
   *          tournamentEventAction                             
   ************************************************************* */
import axios from 'axios';
import {
  TOURNAMENT_EVENTS_REQUEST,
  TOURNAMENT_EVENTS_SUCCESS,
  TOURNAMENT_EVENTS_FAILURE
} from "../../actionTypes";

// tournamentEvent
const tournamentEventRequestAction = () => ({
  type: TOURNAMENT_EVENTS_REQUEST,
});

const tournamentEventSuccessAction = data => ({  
  type: TOURNAMENT_EVENTS_SUCCESS,
  data
});
const tournamentEventFailureAction = error => ({
  type: TOURNAMENT_EVENTS_FAILURE,
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
