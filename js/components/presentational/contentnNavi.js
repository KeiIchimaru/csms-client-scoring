import React from 'react';

const naviClicked = (history, item) => {
  let doJump = true;
  if(item.length == 3) {
    doJump = item[2]();
  }
  if(doJump) history.push(item[1]);
}
// props set by getHeaderProps
const contentNavi = (props) => {
  const items = props.navi.map((item, index) => {
    let border = "";
    if(index == 0) {
      if(props.navi.length == 1) {
        border = "content-navi-item-left content-navi-item-right";
      } else {
        border = "content-navi-item-left";
      }
    } else {
      if(index == props.navi.length-1) {
        border = "content-navi-item-right";
      }
    }
    return (
      <div className={`content-navi-item ${border} d-inline-block`} key={`contentNavi_${index}`} onClick={() => naviClicked(props.history, item)}>{item[0]}</div>
    );
  });  
  return (
      <div className="content-navi w-100 text-center">
        <div>
          {items}
        </div>
      </div>
  );
}
export default contentNavi;

