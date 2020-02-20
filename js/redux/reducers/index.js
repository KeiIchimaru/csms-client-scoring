import { combineReducers } from "redux";
import pageController from "./pageController";
import tournamentEvent from "./tournament/composition/tournamentEvent";
import participatingPlayers from "./tournament/composition/participatingPlayers";
import eventResult from "./tournament/composition/eventResult";
import day from "./tournament/management/day";
import subdivisions from "./tournament/management/subdivisions";

export default combineReducers({
  pageController,
  tournament: combineReducers({ 
    composition:  combineReducers({ tournamentEvent, participatingPlayers, eventResult, }),
    management:   combineReducers({ day, subdivisions, }),
  }),
});
