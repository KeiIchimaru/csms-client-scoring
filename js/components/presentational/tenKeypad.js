import React from 'react';

const tenKeypad = (props) => {
  return (
    <div id="tenKeypad" className="tenKeypad">
      <table>
        <tbody>
          <tr className="line0">
            <td onClick={props.handler}>AC</td>
            <td onClick={props.handler}></td>
            <td onClick={props.handler}>BS</td>
          </tr>
          <tr>
            <td onClick={props.handler}>7</td>
            <td onClick={props.handler}>8</td>
            <td onClick={props.handler}>9</td>
          </tr>
          <tr>
            <td onClick={props.handler}>4</td>
            <td onClick={props.handler}>5</td>
            <td onClick={props.handler}>6</td>
          </tr>
          <tr>
            <td onClick={props.handler}>1</td>
            <td onClick={props.handler}>2</td>
            <td onClick={props.handler}>3</td>
          </tr>
          <tr>
            <td  onClick={props.handler} colSpan="2">0</td>
            <td onClick={props.handler}>.</td>
          </tr>
        </tbody>
      </table>
    </div>
	);
}

export default tenKeypad;