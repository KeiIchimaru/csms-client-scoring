import { getName, NOT_SELECTED } from "../../lib/ulib"
  
export const getHeaderProps = (state) => {
  let ctl = state.pageController;
  let d = state.tournament.management.day;
  let t = state.tournament.composition.tournamentEvent;
  
  let subdivision = null;
  let competitionGroup = null;
  let player = null;
  let participatingPlayer = null;
  if(ctl.subdivision != NOT_SELECTED) {
    let s = state.tournament.management.subdivisions;
    for(let i = 0; i < s.data.length; i++) {
      if(s.data[i].id == ctl.subdivision) {
        subdivision = s.data[i];
        break;
      }
    }
  }
  if(subdivision && ctl.competitionGroup != NOT_SELECTED) {
    for(let i = 0; i < subdivision.competitionGroups.length; i++) {
      if(ctl.competitionGroup == subdivision.competitionGroups[i].id) {
        competitionGroup = subdivision.competitionGroups[i];
        break;
      }
    }
  }
  if(competitionGroup && ctl.bibs != NOT_SELECTED) {
    for(let i = 0; i < competitionGroup.players.length; i++) {
      if(ctl.bibs == competitionGroup.players[i].bibs) {
        player = competitionGroup.players[i];
        participatingPlayer = state.tournament.composition.participatingPlayers[ctl.bibs];
        break;
      }
    }
  }
  return {
      day: d.day,
      gender: ctl.gender,
      genderName: getName(t.genders, ctl.gender),
      classification: ctl.classification,
      classificationName: (t.classifications[ctl.gender] ? getName(t.classifications[ctl.gender], ctl.classification) : null),
      event: ctl.event,
      eventName: (t.events[ctl.gender] && t.events[ctl.gender][ctl.classification] ? getName(t.events[ctl.gender][ctl.classification], ctl.event) : null),
      subdivision,
      competitionGroup,
      player,
      participatingPlayer
  };
};