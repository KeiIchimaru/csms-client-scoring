import React from 'react';

const selectNumber = (props) => {
  const items = Array(props.max).fill().map((_, i) => i+1).map((item) =>
    <option key={item} value={item}>{item}</option>
  );  
  return (
    <select name={props.name} value={props.value} onChange={(e) => props.onChange(props.name, e.target.value)} >
      <option key="0" value="0">--</option>
      {items}
    </select>
	);
}

export default selectNumber;