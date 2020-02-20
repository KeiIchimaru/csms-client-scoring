import React from 'react';

const selectItem = (props) => {
  const items = props.items.map((item) =>
    <option key={item[0]} value={item[0]}>{item[1]}</option>
  );  
  return (
    <select name={props.name} value={props.value} onChange={(e) => props.onChange(e.target.value)} >
      <option key="0" value="0">--選択してください--</option>
      {items};
    </select>
	);
}

export default selectItem;