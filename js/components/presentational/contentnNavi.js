import React from 'react';

// props set by getHeaderProps
const contentNavi = (props) => {
  const items = props.navi.map((item, index) =>
    <div className="item" key={index} onClick={() => props.history.push(item[1])}>{item[0]}</div>
  );  
  return (
      <div className="content-navi">
          {items}
      </div>
  );
}
export default contentNavi;

