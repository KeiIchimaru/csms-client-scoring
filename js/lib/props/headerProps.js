import { getName, NOT_SELECTED } from "../../lib/ulib"
  
export const getHeaderProps = (state) => {
    let p = state.pageController;
    let d = state.tournament.management.day;
    let t = state.tournament.composition.tournamentEvent;
    return {
        day: d.day,
        genderName: getName(t.genders, p.gender),
        classificationName: (t.classifications[p.gender] ? getName(t.classifications[p.gender], p.classification) : null),
        eventName: (t.events[p.gender] && t.events[p.gender][p.classification] ? getName(t.events[p.gender][p.classification], p.event) : null),
        subdivision: (p.subdivision == NOT_SELECTED ? null : p.subdivision),
        competitionGroup: (p.competitionGroup == NOT_SELECTED ? null : p.competitionGroup),
        bibs: (p.bibs == NOT_SELECTED ? null : p.bibs),
    };
};