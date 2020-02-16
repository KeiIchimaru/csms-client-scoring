/* ************************************************************* *
   *          participatingPlayersAction                             
   ************************************************************* */
  import axios from 'axios';
  import {
    PARTICIPATING_PLAYERS_REQUEST,
    PARTICIPATING_PLAYERS_SUCCESS,
    PARTICIPATING_PLAYERS_FAILURE
  } from "../../actionTypes";
  
  const participatingPlayersRequestAction = () => ({
    type: PARTICIPATING_PLAYERS_REQUEST,
  });
  
  const participatingPlayersSuccessAction = data => ({  
    type: PARTICIPATING_PLAYERS_SUCCESS,
    data
  });
  const participatingPlayersFailureAction = error => ({
    type: PARTICIPATING_PLAYERS_FAILURE,
    error
  });
  
  export const participatingPlayersAction = (gender, subdivision, group, bibs) => {
    let url = `/api/tournament/composition/participatingPlayers/${gender}`;
    if(!(subdivision === undefined) && subdivision){
      url += `/${subdivision}`;
      if(!(group === undefined) && group){
        url += `/${group}`;
        if(!(bibs === undefined) && bibs){
          url += `/${bibs}`;
        }
      }
    }    
    return (dispatch) => {
      dispatch(participatingPlayersRequestAction())
      return axios.get(url)
        .then(res =>
          dispatch(participatingPlayersSuccessAction(res.data))
        ).catch(err =>
          dispatch(participatingPlayersFailureAction(err))
        )
    }
  };
  