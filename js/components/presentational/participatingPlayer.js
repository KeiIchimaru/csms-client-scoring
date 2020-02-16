import React from 'react';

const shortFrom = (score) => (
  <td>{score ? "???" : "演技前"}</td>
);
const longFrom = (score) => (
   <>
    <td className="score boderLeft2"></td>
    <td className="score"></td>
    <td className="score boderLeft2"></td>
    <td className="score"></td>
    <td className="score"></td>
    <td className="score"></td>
    <td className="boderLeft2"></td>
    <td></td>
    <td></td>
    <td className="boderLeft2">{score ? "???" : "演技前"}</td>
  </>
);
const participatingPlayer = (props) => {
  let p = props.player;
  let pp = props.participatingPlayer;
  let score = (pp ? pp.scores[props.event] : null)
  let displayScore = (props.isShort ? shortFrom(score) : longFrom(score));
  return (
    <>
      <td className="bibs linkBibs" onClick={e => { props.competitionGroup ? props.onClick(props.competitionGroup, p.bibs) : props.onClick(p.bibs)}}>
        {pp ? parseInt(pp.bibs) : ""}
      </td>
      <td className="playerName">
      <div><ruby>
          <rb>{pp ? pp.player_name : ""}</rb>
          <rp>（</rp>
          <rt>{pp ? pp.player_furigana : ""}</rt>
          <rp>）</rp>
      </ruby></div>
      </td>
      <td className="actingOrder">{p ? p.sequence : ""}</td>
      {displayScore}
    </>
  )}

export default participatingPlayer;