import { NOT_SELECTED } from "./constant";
import { getName } from "./ulib"

export const CSS_TOP_NUMBER = "top-number";

export const getStateError = (state) => {
  let c = state.tournament.composition;
  let m = state.tournament.management;
  return  c.tournamentEvent.error ||
          c.participatingPlayers.error ||
          c.eventResult.error ||
          m.subdivisions.error;
};
export const getFetching = (state) => {
  let c = state.tournament.composition;
  let m = state.tournament.management;
  return  c.tournamentEvent.isFetching ||
          c.participatingPlayers.isFetching ||
          c.eventResult.isFetching ||
          m.subdivisions.isFetching;
}
export const getHeaderProps = (state) => {
  let ctl = state.pageController;
  let d = state.tournament.management.day;
  let t = state.tournament.composition.tournamentEvent;
  let pp = state.tournament.composition.participatingPlayers;
  
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
        participatingPlayer = pp.players[ctl.bibs];
        break;
      }
    }
  }
  let event = null;
  for (var row of (t.events[ctl.gender] && t.events[ctl.gender][ctl.classification] ? t.events[ctl.gender][ctl.classification] : [])) {
    if(row.id == ctl.event) {
      event = row;
      break;
    }
  }
  return {
      day: d.day,
      gender: ctl.gender,
      genderName: getName(t.genders, ctl.gender),
      classification: ctl.classification,
      classificationName: (t.classifications[ctl.gender] ? getName(t.classifications[ctl.gender], ctl.classification) : null),
      event,
      subdivision,
      competitionGroup,
      player,
      participatingPlayer
  };
};
export const isValidityPlayer = (participatingPlayer) => {
  return (participatingPlayer && participatingPlayer.validity == 1);
}
export const isTopNumber = (bibs, teamScore) => {
  for(let score of teamScore.players) {
    if(bibs == score.bibs) return true;
  }
  return false;
}
export const getEventTeamScore = (event, players, participatingPlayers, confirmed=false, number=3 ) => {
  let numberOfPlayer = 0;
  let numberOfActed = 0;
  let numberOfConfirmed = 0;
  let playersScore = [];
  for (let key in players) {
    let pp = participatingPlayers[players[key].bibs];
    let validity = isValidityPlayer(pp);
    let score = (pp ? pp.scores[event] : null);
    if(score && (!confirmed || confirmed && score.confirmed_user != null)) {
      playersScore.push({ bibs: pp.bibs, score: score.event_score });
    }
    // 選手として棄権していても、すでに演技済みの場合は得点を有効とする。
    if(validity || score) {
      numberOfPlayer++;
      if(score) {
        numberOfActed++;
        if(score.confirmed_user) {
          numberOfConfirmed++;
        } 
      }
    }
  }
  playersScore.sort((o1, o2) => {
    // 降順にソート
    if(o1.score < o2.score) return 1;
    if(o1.score > o2.score) return -1;
    return 0;
  });
  let ttlScore = 0.0;
  let scores = [];
  for(let i = 0 ; i < number && i < playersScore.length; i++) {
    ttlScore += playersScore[i].score;
    scores.push(playersScore[i]);
  }
  return {
    numberOfPlayer,
    numberOfActed,
    numberOfConfirmed,
    score: (scores.length > 0 ? ttlScore : null),
    players: scores
  } ;
}