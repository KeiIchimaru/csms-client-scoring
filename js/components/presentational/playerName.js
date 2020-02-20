import React from 'react';

const playerName = (props) => (
  <ruby>
    <rb>{props.player ? props.player.player_name : ""}</rb>
    <rp>（</rp>
    <rt>{props.player ? props.player.player_furigana : ""}</rt>
    <rp>）</rp>
  </ruby>
);

export default playerName;