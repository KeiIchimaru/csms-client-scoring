import React from 'react';

import { getDisplayTime } from "../../lib/ulib";

// props set by getHeaderProps
const contentHeader = (props) => {
  let subdivision = null;
  let competitionGroup = null;
  if(props.header.subdivision) {
    let s = props.header.subdivision;
    subdivision = 
      <h2>
        {`${s.number}班`}
        <span className="">
          {`(練習開始:${getDisplayTime(s.practice_start_time)},`}&ensp;{`演技開始:${getDisplayTime(s.start_time)},`}&ensp;{`演技終了:${getDisplayTime(s.end_time)})`}
        </span>
      </h2>
    ; 
  }
  if(props.header.competitionGroup) {
    competitionGroup =
    <h3>
      `${props.header.competitionGroup}組`
    </h3> 
  }
  return (
    <div className="content-header w-100">
      <h1>大会{props.header.day}日目 {props.header.genderName} {props.header.eventName}</h1>
      {subdivision}{competitionGroup}
    </div>
  );
}
  
export default contentHeader;