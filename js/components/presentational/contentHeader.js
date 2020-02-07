import React from 'react';

// props set by getHeaderProps
const contentHeader = (props) => {
  let subHeader;
  let text = null;
  if(props.header.subdivision) {
    text = `${props.header.subdivision}班`
  }
  if(props.header.competitionGroup) {
    text += `・${props.header.competitionGroup}組`
  }
  if(text) {
    subHeader = (
      <h2>{text}</h2>
    ); 
  }
  return (
    <div className="content-header">
      <h1>大会{props.header.day}日目 {props.header.genderName} {props.header.eventName}</h1>
      {subHeader}
    </div>
  );
}
  
export default contentHeader;