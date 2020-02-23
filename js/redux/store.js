import thunk from 'redux-thunk'
import logger from 'redux-logger'
import { createStore, applyMiddleware } from "redux";
import rootReducer from "./reducers/index";     // indexを省略しても可
import { tournamentAction } from './actions/tournament/composition/tournamentAction';
import { tournamentEventAction } from './actions/tournament/composition/tournamentEventAction';
import { dayAction } from "./actions/tournament/management/dayAction";

const store = createStore(
    rootReducer,
    applyMiddleware(thunk, logger)
)
store.dispatch(tournamentAction())
store.dispatch(tournamentEventAction())
store.dispatch(dayAction())

export default store;
