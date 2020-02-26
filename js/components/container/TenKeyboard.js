import React from 'react';

import TenKeypad from "../presentational/tenKeypad";

class TenKeyboard {
  constructor() {
    this._field = null;
  }
  clickHandler(e) {
    console.log("clickHandler", e.target.innerHTML);
  }
  setTarget(target) {
    this._field = target;
    console.log("setTarget", target);
  }
  render() {
    return <TenKeypad handler={this.clickHandler} />
  }

};

export default TenKeyboard;