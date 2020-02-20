/* ************************************************************* *
   *          participatingPlayers (reducer)                          
   ************************************************************* */
  import { getResponceError } from "../../../../lib/ulib";
  import {
    PARTICIPATING_PLAYERS_REQUEST,
    PARTICIPATING_PLAYERS_SUCCESS,
    PARTICIPATING_PLAYERS_FAILURE
  } from "../../../actions/actionTypes";
  
  const initialState = {
    isFetching: false,
    players: {},
    error: null
  }

  const participatingPlayers = (state = initialState, action) => {
    switch (action.type) {
      case PARTICIPATING_PLAYERS_REQUEST: {
        // Object.assign(target, ...sources)
        // 初めの引数を{}としているのはstateの内容を変更しない為
        return Object.assign({}, initialState, { isFetching: true });
      }
      case PARTICIPATING_PLAYERS_SUCCESS: {
        return Object.assign({}, initialState, { players: action.data });
      }
      case PARTICIPATING_PLAYERS_FAILURE: {
        let error = getResponceError(action.error.response);
        return Object.assign({}, initialState, { error });
      }
      default: {
        return state;
      }
    }
  };
  
  export default participatingPlayers;
  