/* ************************************************************* *
   *                    subdivisionsAction                             
   ************************************************************* */
import axios from 'axios';
import {
  SUBDIVISIONS_REQUEST,
  SUBDIVISIONS_SUCCESS,
  SUBDIVISIONS_FAILURE
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
