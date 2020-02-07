/* ************************************************************* *
   *          tournamentEvent (reducer)                          
   ************************************************************* */
import { getResponceError } from "../../../../lib/ulib";
import {
  TOURNAMENT_EVENTS_REQUEST,
  TOURNAMENT_EVENTS_SUCCESS,
  TOURNAMENT_EVENTS_FAILURE
} from "../../../actions/actionTypes";

const initialState = {
  isFetching: false,
  genders: [],          // [(id, name), ...]
  classifications: {},  // {gender: [(id, name), ...]}
  events: {},           // {gender: {classification: [{id, name, ...}, ...]}
  error: null
}

const _makeState = (state, action) => {
  // viewTournamentEventが返る
  let genders = [];
  let classifications = {};
  let events = {};

  let gender_id = null;
  let classification_id = null;
  let data_c ={};
  let name_c = [];
  let data_e =[];

  // １件目のデータで初期化
  let row = action.data[0];
  gender_id = row.gender_id;
  genders.push([row.gender_id, row.gender_name]);
  classification_id = row.classification_id;
  name_c.push({id: row.classification_id, name: row.classification_name});
  // データ処理
  for(let i = 0; i < action.data.length; i++) {
    row = action.data[i];
    if(gender_id != row.gender_id) {
      classifications[gender_id] = name_c;
      data_c[classification_id] = data_e;
      events[gender_id] = data_c
      // 新しい性別の初期化
      data_c ={};
      name_c = [];
      data_e =[];
      gender_id = row.gender_id;
      genders.push([row.gender_id, row.gender_name]);
      classification_id = row.classification_id;
      name_c.push([row.classification_id, row.classification_name]);
    }
    if(classification_id != row.classification_id) {
      data_c[classification_id] = data_e;
      // 新しい競技種別の初期化
      data_e = [];
      classification_id = row.classification_id;
      name_c.push([row.classification_id, row.classification_name]);
    }
    data_e.push({
      id: row.event_id,
      name: row.event_name,
      abbreviation: row.event_abbreviation,
      measurement: row.measurement
    });
  }
  classifications[gender_id] = name_c;
  data_c[classification_id] = data_e;
  events[gender_id] = data_c
  return Object.assign({}, state, {
    isFetching: false,
    genders,
    classifications,
    events,
    error: null
  });
}

const tournamentEvent = (state = initialState, action) => {
  switch (action.type) {
    case TOURNAMENT_EVENTS_REQUEST: {
      // Object.assign(target, ...sources)
      // 初めの引数を{}としているのはstateの内容を変更しない為
      return Object.assign({}, state, { isFetching: true });
    }
    case TOURNAMENT_EVENTS_SUCCESS: {
      return _makeState(state, action);
    }
    case TOURNAMENT_EVENTS_FAILURE: {
      let error = getResponceError(action.error.response);
      return Object.assign({}, state, { error });
    }
    default: {
      return state;
    }
  }
};

export default tournamentEvent;