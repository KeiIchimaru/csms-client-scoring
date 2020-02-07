import React from 'react';

const changeValue = (event, action) => {
  action(event.target.value);
}
const selectItem = (props) => {
  const items = props.items.map((item) =>
    <option key={item[0]} value={item[0]}>{item[1]}</option>
  );  
  return (
    <select name={props.name} defaultValue={props.value} onChange={(e) => changeValue(e, props.change)} >
      <option key="0" value="0">--選択してください--</option>
      {items};
    </select>
	);
}

export default selectItem;