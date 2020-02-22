/* ************************************************************* *
   *          eventResultRegisterAction                             
   ************************************************************* */
  import axios from 'axios';
  import {
    EVENT_RESULT_REQUEST,
    EVENT_RESULT_SUCCESS,
    EVENT_RESULT_FAILURE
  } from "../../actionTypes";
  
  // tournamentEvent
  const eventResultRequestAction = () => ({
    type: EVENT_RESULT_REQUEST,
  });
  
  const eventResultSuccessAction = () => ({  
    type: EVENT_RESULT_SUCCESS,
  });
  const eventResultFailureAction = error => ({
    type: EVENT_RESULT_FAILURE,
    error
  });
  
export const eventResultRegisterAction = (header, data) => {
  return (dispatch) => {
    dispatch(eventResultRequestAction());
    return axios.get('/csrf-token')
    .then(res =>
      axios.post('/api/tournament/composition/result/register',
        {
          header: {
              gender: header.gender,
              classification: header.classification,
              event: header.event,
              subdivision: header.subdivision.is,
              competitionGroup: header.competitionGroup.id,
              bibs: header.player.bibs,
              player: header.participatingPlayer.player_id,
              entry_organization_id: header.participatingPlayer.entry_organization_id
          },
          input: data
        }, {
          headers: { 'csrf-token': res.data.token },
        }
      )
    ).then(res => 
      dispatch(eventResultSuccessAction())
    ).catch(err =>
      dispatch(eventResultFailureAction(err))
    );
  };
};

export const eventResultConfirmAction = (header, players, next=null) => {
  return (dispatch) => {
    dispatch(eventResultRequestAction());
    return  axios.get('/csrf-token')
    .then(res =>
      axios.post('/api/tournament/composition/result/confirm',
        {
          header: {
              gender: header.gender,
              classification: header.classification,
              event: header.event,
              subdivision: header.subdivision.is,
              competitionGroup: header.competitionGroup.id,
          },
          players
        }, {
          headers: { 'csrf-token': res.data.token },
        }
      )
    ).then(res => {
      if (next) next();
      return dispatch(eventResultSuccessAction());
    }).catch(err =>
      dispatch(eventResultFailureAction(err))
    );
  };
};