import React from 'react';

import TenKeypad from "../presentational/tenKeypad";

class TenKeyboard {
  constructor(setFieldValue) {
    this._field = null;
    this.setFieldValue = setFieldValue;
    this.clickHandler = this.clickHandler.bind(this);
  }
  clickHandler(e) {
    if(this._field) {
      let state = {};
      switch(e.target.innerHTML) {
        case "AC":
          state[this._field.name] = null;
          this.setFieldValue(state);
          break;
        case "BS":
          if(this._field.value) {
            state[this._field.name] = this._field.value.slice(0, this._field.value.length-1); 
            this.setFieldValue(state);
            }
          break;
        case "":
          break;
        default:
          const newValue = this._field.value + e.target.innerHTML;
          let result = newValue.match(this._field.pattern);
          if(result[0].length > 0) {
            state[this._field.name] = newValue;
            this.setFieldValue(state);
            }
          break;
      }
    }
  }
  setTarget(event, onBlur) {
    if(this._field) {
      if(onBlur) onBlur(this._field);
    }
    this._field = event;
  }
  render() {
    return <TenKeypad handler={this.clickHandler} />
  }
  get fourcusStyle() {
    return "tenKeyboardFourcus";
  }
};

export default TenKeyboard;