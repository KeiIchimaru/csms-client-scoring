import React from 'react';

import { isValidityPlayer } from "../../lib/propsLib";

// React Component
import PlayerName from "./playerName";

const displayValidity = (validity) => (validity ? "演技前" : "棄権");

// 棄権でもすでに演技済みの場合は得点を表示する。
const shortFrom = (validity, scoreStyle, score) => (
  <td className={scoreStyle}>{score ? score.event_score : displayValidity(validity)}</td>
);
const longFrom = (validity, scoreStyle, score) => {
  let s = score ? JSON.parse(score.constitution) : null;
  let scoreClassName = `boderLeft2 boderRight2 ${scoreStyle}`;
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
    <td className={scoreClassName}>{score ? score.event_score : displayValidity(validity)}</td>
  </>
)};
const participatingPlayer = (props) => {
  let p = props.player;
  let pp = props.participatingPlayer;
  let validity = isValidityPlayer(pp);
  let score = (pp ? pp.scores[props.event] : null)
  let displayScore = (props.isShort ? shortFrom(validity, props.scoreStyle, score) : longFrom(validity, props.scoreStyle, score));
  // 入力可能かの判定（棄権していても、既に演技済みだが承認されていない場合は入力可）
  let doInput = true;
  if(score && score.confirmed_user != null) {
    doInput = false; // 採点が既に承認済み
  } else if (score == null && !validity) {
    doInput = false; // 演技前で棄権している
  }
  return (
    <>
      { doInput &&
      <td className="bibs boderLeft2 linkBibs" onClick={e => { props.competitionGroup ? props.onClick(props.competitionGroup, p.bibs) : props.onClick(p.bibs)}}>
        {pp ? parseInt(pp.bibs) : ""}
      </td>
      }
      { !doInput &&
      <td className="bibs boderLeft2">
        {pp ? parseInt(pp.bibs) : ""}
      </td>
      }
      <td className="playerName">
        <div>
          <PlayerName player={pp} />
        </div>
      </td>
      { !props.isShort &&
        <td className="actingOrder">{p ? p.sequence : ""}</td>
      }
      {displayScore}
    </>
  )}

export default participatingPlayer;