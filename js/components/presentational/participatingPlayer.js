import React from 'react';

import { isValidityPlayer } from "../../lib/propsLib";

// React Component
import PlayerName from "./playerName";

const displayValidity = (validity) => (validity ? "演技前" : "棄権");

const shortFrom = (validity, score) => (
  <td>{score ? score.event_score : displayValidity(validity)}</td>
);
const longFrom = (validity, score) => {
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
    <td className="boderLeft2 boderRight2">{score ? score.event_score : displayValidity(validity)}</td>
  </>
)};
const participatingPlayer = (props) => {
  let p = props.player;
  let pp = props.participatingPlayer;
  let validity = isValidityPlayer(pp);
  let score = (pp ? pp.scores[props.event] : null)
  let displayScore = (props.isShort ? shortFrom(validity, score) : longFrom(validity, score));
  return (
    <>
      { validity &&
      <td className="bibs boderLeft2 linkBibs" onClick={e => { props.competitionGroup ? props.onClick(props.competitionGroup, p.bibs) : props.onClick(p.bibs)}}>
        {pp ? parseInt(pp.bibs) : ""}
      </td>
      }
      { !validity &&
      <td className="bibs boderLeft2">
        {pp ? parseInt(pp.bibs) : ""}
      </td>
      }
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