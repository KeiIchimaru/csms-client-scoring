/* ************************************************************* *
   *          subdivisions (reducer)                          
   ************************************************************* */
import { getResponceError } from "../../../../lib/ulib";
import {
  SUBDIVISIONS_REQUEST,
  SUBDIVISIONS_SUCCESS,
  SUBDIVISIONS_FAILURE,
  SUBDIVISIONS_PLAYER_SEQUENCE,
  SUBDIVISIONS_PLAYER_SORT_SEQUENCE,
  SUBDIVISIONS_PLAYER_SORT_BIBS
} from "../../../actions/actionTypes"

const initialState = {
  isFetching: false,
  data: [],
  error: null
}

const _setSubdivision = (row) => ({
  id: row.s_id,
  name: row.s_name,
  abbreviation: row.s_abbreviation,
  number: row.s_number,
  practice_start_time: row.s_practice_start_time,
  start_time: row.s_start_time,
  end_time: row.s_end_time,
})
const _setCompetitionGroup = (row) => ({
  id: row.c_id,
  number: row.c_number,
  name: row.c_name,
  abbreviation: row.c_abbreviation,
  organization_id: row.c_entry_organization_id,
  organization_name: row.o_organization_name,
})
const _makeState = (state, action) => {
  let s_id = null;  // 班
  let c_id = null;  // 組
  let subdivisions = [];
  let subdivision = {};
  let competitionGroups = [];
  let competitionGroup = {};
  let players = [];
  let row;

  function _changeCompetitionGroup() {
    competitionGroup.players = players;
    competitionGroups.push(competitionGroup);
    // for next
    competitionGroup = _setCompetitionGroup(row);
    players = [];
    c_id = row.c_id;
  }
  function _changeSubdivision() {
    _changeCompetitionGroup();
    subdivision.competitionGroups = competitionGroups;
    subdivisions.push(subdivision);
    // for next
    subdivision = _setSubdivision(row);
    competitionGroups = [];
    s_id = row.s_id;
  }
  // １件目のデータで初期化
  row = action.data[0];
  s_id = row.s_id;
  c_id = row.c_id;
  subdivision = _setSubdivision(row);
  competitionGroup = _setCompetitionGroup(row);
  // データ処理
  for(let i = 0; i < action.data.length; i++) {
    row = action.data[i];
    if(s_id != row.s_id){
      _changeSubdivision();
    }
    if(c_id != row.c_id){
      _changeCompetitionGroup();
    }
    players.push({
      bibs: row.p_bibs,
      entry_organization_id: row.c_entry_organization_id,
      sequence: row.p_sequence
    });
  }
  _changeSubdivision();
  return {
    ...initialState,
    data: subdivisions,
  }
}

const subdivisions = (state = initialState, action) => {
  switch (action.type) {
    case SUBDIVISIONS_REQUEST: {
      // 連想配列{}においてキーが重複していた場合は、後のデータで上書きされるという仕様を利用しています。
      return {
        ...initialState,
        isFetching: true
      };
    }
    case SUBDIVISIONS_SUCCESS: {
      return _makeState(state, action);
    }
    case SUBDIVISIONS_FAILURE: {
      let error = getResponceError(action.error.response);
      // データはクリアする。
      return {
        ...initialState,
        error
      };
    }
    case SUBDIVISIONS_PLAYER_SEQUENCE: {
      let newState = { ...state };
      for(let i = 0; i < newState.data.length; i++) {
        if(newState.data[i].id == action.data.subdivision) {
          for(let j = 0; j < newState.data[i].competitionGroups.length; j++) {
            if(newState.data[i].competitionGroups[j].id == action.data.competitionGroup) {
              for(let k = 0; k < newState.data[i].competitionGroups[j].players.length; k++) {
                if(newState.data[i].competitionGroups[j].players[k].bibs == action.data.bibs) {
                  newState.data[i].competitionGroups[j].players[k].sequence = action.data.sequence;
                }
              }
            }
          }
        }
      }
      return newState;
    }
    case SUBDIVISIONS_PLAYER_SORT_SEQUENCE: {
      let newState = { ...state };
      for(let i = 0; i < newState.data.length; i++) {
        if(newState.data[i].id == action.data.subdivision) {
          for(let j = 0; j < newState.data[i].competitionGroups.length; j++) {
            if(newState.data[i].competitionGroups[j].id == action.data.competitionGroup) {
              newState.data[i].competitionGroups[j].players.sort((a, b) => {
                if(a.sequence == null && b.sequence == null) {
                  if(a.bibs < b.bibs) return -1;
                  if(a.bibs > b.bibs) return 1;
                  return 0;
                }
                if(a.sequence == null && b.sequence != null) return -1;
                if(a.sequence != null && b.sequence == null) return 1;
                return a.sequence - b.sequence;
              });
            }
          }
        }
      }
      return newState;
    }
    case SUBDIVISIONS_PLAYER_SORT_BIBS: {
      let newState = { ...state };
      for(let i = 0; i < newState.data.length; i++) {
        if(newState.data[i].id == action.data.subdivision) {
          for(let j = 0; j < newState.data[i].competitionGroups.length; j++) {
            if(newState.data[i].competitionGroups[j].id == action.data.competitionGroup) {
              newState.data[i].competitionGroups[j].players.sort((a, b) => {
                if(a.bibs < b.bibs) return -1;
                if(a.bibs > b.bibs) return 1;
                return 0;
              });
            }
          }
        }
      }
      return newState;
    }
    default: {
        return state;
    }
  }
};
  
export default subdivisions;