import React from 'react';

// React Component
import PlayerName from "./playerName";

const shortFrom = (score) => (
  <td>{score ? score.event_score : "演技前"}</td>
);
const longFrom = (score) => {
  let s = score ? JSON.parse(score.constitution) : null;
  return (
  <>
    <td className="score boderLeft2">{score ? s.d2 : null}</td>
    <td className="score">{score ? s.d1 : null}</td>
    <td className="score boderLeft2">{score ? s.e1 : null}</td>
    <td className="score">{score ? s.e2 : null}</td>
    <td className="score">{score ? s.e3 : null}</td>
    <td className="score">{score ? s.e4 : null}</td>
    <td className="boderLeft2">{score ? s.et : null}</td>
    <td>{score ? s.e : null}</td>
    <td>{score ? s.penalty : null}</td>
    <td className="boderLeft2">{score ? score.event_score : "演技前"}</td>
  </>
)};
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
        <div>
          <PlayerName player={pp} />
        </div>
      </td>
      <td className="actingOrder">{p ? p.sequence : ""}</td>
      {displayScore}
    </>
  )}

export default participatingPlayer;