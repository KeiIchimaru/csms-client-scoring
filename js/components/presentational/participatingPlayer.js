import React from 'react';

const changeValue = (event, action) => {
  action(event.target.value);
}
const participatingPlayer = (props) => {
  let p = props.participatingPlayer;
  let score = "演技前";
  return (
    <>
      <td className="bibs linkBibs">
        {p ? parseInt(p.bibs) : ""}
      </td>
      <td className="playerName">
      <div><ruby>
          <rb>{p ? p.player_name : ""}</rb>
          <rp>（</rp>
          <rt>{p ? p.player_furigana : ""}</rt>
          <rp>）</rp>
      </ruby></div>
      </td>
      <td className="score">{score}</td>
    </>
  )}

export default participatingPlayer;