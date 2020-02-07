/* ************************************************************* *
   *                    pageControllerAction                             
   ************************************************************* */
import {
    PAGE_CONTROLLER_GENDER,
    PAGE_CONTROLLER_CLASSIFICATION,
    PAGE_CONTROLLER_EVENT,
    PAGE_CONTROLLER_SUBDIVISION,
    PAGE_CONTROLLER_COMPETITION_GROUP,
    PAGE_CONTROLLER_BIBS,

    PAGE_INITIALIZE_COMPETITION,
    PAGE_INITIALIZE_SUBDIVISION,
    PAGE_INITIALIZE_GROUP,
    PAGE_INITIALIZE_PLAYER,
    PAGE_INITIALIZE_INPUT,
  } from "./actionTypes";

  // PAGE: Competition
export const pageInitializeCompetitionAction = () => ({
    type: PAGE_INITIALIZE_COMPETITION,
});
export const pageControllerGenderAction = value => ({
    type: PAGE_CONTROLLER_GENDER,
    value
});
export const pageControllerClassificationAction = value => ({
    type: PAGE_CONTROLLER_CLASSIFICATION,
    value
});
export const pageControllerEventAction = value => ({
    type: PAGE_CONTROLLER_EVENT,
    value
});
// PAGE: Subdivision
export const pageInitializeSubdivisionAction = () => ({
    type: PAGE_INITIALIZE_SUBDIVISION,
});
export const pageControllerSubdivisionAction = value => ({
    type: PAGE_CONTROLLER_SUBDIVISION,
    value
});
// PAGE: Group 
export const pageInitializeGroupAction = () => ({
    type: PAGE_INITIALIZE_GROUP,
});
export const pageControllerCompetitionGroupAction = value => ({
    type: PAGE_CONTROLLER_COMPETITION_GROUP,
    value
});
// PAGE: Player
export const pageInitializePlayerAction = () => ({
    type: PAGE_INITIALIZE_PLAYER,
});
export const pageControllerBibsAction = value => ({
    type: PAGE_CONTROLLER_BIBS,
    value
});