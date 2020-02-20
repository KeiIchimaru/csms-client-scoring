import { NOT_SELECTED } from "../../lib/ulib";
import {
  PAGE_CONTROLLER_GENDER,
  PAGE_CONTROLLER_CLASSIFICATION,
  PAGE_CONTROLLER_EVENT,
  PAGE_CONTROLLER_SUBDIVISION,
  PAGE_CONTROLLER_COMPETITION_GROUP,
  PAGE_CONTROLLER_BIBS,

  PAGE_INITIALIZE_COMPETITION,
  PAGE_INITIALIZE_SUBDIVISION,
  PAGE_INITIALIZE_COMPETITION_GROUP,
  PAGE_INITIALIZE_BIBS,
  PAGE_INITIALIZE_INPUT,
} from "../actions/actionTypes"

const initialState = {
  gender: NOT_SELECTED,
  classification: NOT_SELECTED,
  event: NOT_SELECTED,
  subdivision: NOT_SELECTED,
  competitionGroup: NOT_SELECTED,
  bibs: NOT_SELECTED
}
  
const pageController = (state = initialState, action) => {
  switch (action.type) {
    case PAGE_INITIALIZE_COMPETITION: {
      return Object.assign({}, state, { subdivision: NOT_SELECTED, competitionGroup: NOT_SELECTED, bibs: NOT_SELECTED });
    }
    case PAGE_INITIALIZE_SUBDIVISION: {
      return Object.assign({}, state, { subdivision: NOT_SELECTED, competitionGroup: NOT_SELECTED, bibs: NOT_SELECTED });
    }
    case PAGE_INITIALIZE_COMPETITION_GROUP: {
      return Object.assign({}, state, { competitionGroup: NOT_SELECTED, bibs: NOT_SELECTED });
    }
    case PAGE_INITIALIZE_BIBS: {
      return Object.assign({}, state, { bibs: NOT_SELECTED });
    }

    case PAGE_CONTROLLER_GENDER: {
      let v = parseInt(action.value);
      let classification = (state.gender == v ? state.classification : NOT_SELECTED);
      let event = (state.gender == v ? state.event : NOT_SELECTED);
      return Object.assign({}, state, { gender: v, classification, event });
    }
    case PAGE_CONTROLLER_CLASSIFICATION: {
      return Object.assign({}, state, { classification: parseInt(action.value) });
    }
    case PAGE_CONTROLLER_EVENT: {
      return Object.assign({}, state, { event: parseInt(action.value) });
    }
    case PAGE_CONTROLLER_SUBDIVISION: {
      return Object.assign({}, state, { subdivision: parseInt(action.value) });
    }
    case PAGE_CONTROLLER_COMPETITION_GROUP: {
      return Object.assign({}, state, { competitionGroup: parseInt(action.value) });
    }
    case PAGE_CONTROLLER_BIBS: {
      return Object.assign({}, state, { bibs: action.value });
    }
    default: {
      return state;
    }
  }
};

export default pageController;