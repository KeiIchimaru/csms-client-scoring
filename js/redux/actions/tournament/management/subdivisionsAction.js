/* ************************************************************* *
   *                    subdivisionsAction                             
   ************************************************************* */
import axios from 'axios';
import {
  SUBDIVISIONS_REQUEST,
  SUBDIVISIONS_SUCCESS,
  SUBDIVISIONS_FAILURE,
  SUBDIVISIONS_PLAYER_SEQUENCE,
  SUBDIVISIONS_PLAYER_SORT_SEQUENCE,
  SUBDIVISIONS_PLAYER_SORT_BIBS
} from "../../actionTypes";

const subdivisionsRequestAction = () => ({
type: SUBDIVISIONS_REQUEST,
});
const subdivisionsSuccessAction = data => ({  
    type: SUBDIVISIONS_SUCCESS,
    data
});
const subdivisionsFailureAction = error => ({
    type: SUBDIVISIONS_FAILURE,
    error
});
export const subdivisionsPlayerSequenceAction = (subdivision, competitionGroup, bibs, sequence) => ({
    type: SUBDIVISIONS_PLAYER_SEQUENCE,
    data: { subdivision, competitionGroup, bibs, sequence }
});
export const subdivisionsPlayerSortSequenceAction = (subdivision, competitionGroup) => ({
    type: SUBDIVISIONS_PLAYER_SORT_SEQUENCE,
    data: { subdivision, competitionGroup }
});
export const subdivisionsPlayerSortBibsAction = (subdivision, competitionGroup) => ({
    type: SUBDIVISIONS_PLAYER_SORT_BIBS,
    data: { subdivision, competitionGroup }
});
export const subdivisionsAction = (gender, classification, event) => {
    return (dispatch) => {
        dispatch(subdivisionsRequestAction())
        let url = `/api/tournament/management/subdivisions/${gender}/${classification}/${event}`;
        return axios.get(url)
        .then(res =>
            dispatch(subdivisionsSuccessAction(res.data))
        ).catch(err => 
            dispatch(subdivisionsFailureAction(err))
        )
    }
};
