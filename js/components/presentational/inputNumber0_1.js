import React from 'react';

const InputNumber0_1 = (props) => {
  let min = props.min ? props.min : 0;
  let max = props.max ? props.max : 100;
  let val = props.value ? props.value : null;
  // Reactの場合readOnly(≠readonly)
  return (
    <input readOnly type="number" name={props.name} className={props.className} min={min} max={max} defaultValue={val} step="0.1" />
  );  
}

export default InputNumber0_1;