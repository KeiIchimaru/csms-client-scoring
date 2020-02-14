import React from 'react';

import { getDisplayTime, getOrganizationName } from "../../lib/ulib";

// props set by getHeaderProps
const contentHeader = (props) => {
  let subdivision = null;
  let h1_subdivision = null;
  let competitionGroup = null;
  let h1_competitionGroup = null;
  if(props.header.subdivision) {
    let s = props.header.subdivision;
    h1_subdivision = `${s.number}班`;
    subdivision = <h2>{`[練習開始:${getDisplayTime(s.practice_start_time)},`}&ensp;{`演技開始:${getDisplayTime(s.start_time)},`}&ensp;{`演技終了:${getDisplayTime(s.end_time)}]`}</h2>
  }
  if(props.header.competitionGroup) {
    let g = props.header.competitionGroup;
    h1_competitionGroup = `${g.number}組`;
    competitionGroup = <h3>{h1_competitionGroup}&ensp;{getOrganizationName(g.organization_name)}</h3> 
  }
  return (
    <div className="content-header w-100">
      <h1>大会{props.header.day}日目&ensp;{props.header.genderName}&ensp;{props.header.eventName}&ensp;{h1_subdivision}</h1>
      {subdivision}{competitionGroup}
    </div>
  );
}
  
export default contentHeader;