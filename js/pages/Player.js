import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Redirect } from 'react-router-dom';
import { connect } from "react-redux";

import { NOT_SELECTED, getMessage } from "../lib/ulib";
import { TITLE_COMPETITION, TITLE_SUBDIVISION, TITLE_GROUP, TITLE_PLAYER } from "../lib/messages";
import { getHeaderProps } from "../lib/props/headerProps";

// Redux Action
import {
  pageControllerBibsAction,
} from "../redux/actions/pageControllerAction";
import {
  participatingPlayersAction,
} from "../redux/actions/tournament/composition/participatingPlayersAction";

// React Component
import Error from "../components/presentational/error";
import Loading from "../components/presentational/loading";
import ContentHeader from "../components/presentational/contentHeader";
import ContentnNavi from "../components/presentational/contentnNavi";
import ParticipatingPlayer from "../components/presentational/participatingPlayer";

class Player extends Component {
  constructor(props) {
    super(props);
    // 参照：https://qiita.com/konojunya/items/fc0cfa6a56821e709065
    this.redirectInput = this.redirectInput.bind(this);
  }
  componentDidMount() {
    document.title = getMessage(TITLE_PLAYER);
    let h = this.props.header;
    // ブラウザのリロードを押された場合、stateはクリアされる。(redirectの前にcallされる)
    if(h.day) {
      this.props.dispatchParticipatingPlayers(h.gender, h.subdivision.id, h.competitionGroup.id);
    }
  }
  redirectInput(bibs) {
    this.props.changeBibs(bibs);
    this.props.history.push('/input')
  }
  renderView() {
    let h = this.props.header;
    const players = this.props.players.map((player, i) => 
      <tr key={`${Player.displayName}_${i}`}>
        <ParticipatingPlayer event={this.props.header.event} player={player} participatingPlayer={this.props.participatingPlayers[player.bibs]} onClick={this.redirectInput} />
      </tr>
    );
    let navi = [
      [getMessage(TITLE_COMPETITION), "/"],
      [getMessage(TITLE_SUBDIVISION), "/subdivision"],
      [getMessage(TITLE_GROUP), "/group"],
    ];
    return (
      <div className="player">
        <ContentHeader header={this.props.header} />
        <ContentnNavi navi={navi} history={this.props.history} />
        <div className="content-body">
          <table className="w-100">
            <thead>
              <tr>
                <th>番</th>
                <th>氏名</th>
                <th className="actingOrderTitle">演技順</th>
                <th className="boderLeft2">D2</th>
                <th>D1</th>
                <th className="boderLeft2">E1</th>
                <th>E2</th>
                <th>E3</th>
                <th>E4</th>
                <th className="boderLeft2">E計</th>
                <th>合計</th>
                <th>減点</th>
                <th className="boderLeft2">決定点</th>
              </tr>
            </thead>
            <tbody>
              {players}
            </tbody>
          </table>
        </div>
        <div  className="content-footer">
        </div>
      </div>
    );
  }
  render() {
    if(this.props.error) {
      return (
        <Error error={this.props.error} />
      );
    }
    if(this.props.isFetching) {
      return (
        <Loading />
      );
    }
    if(!this.props.isPermittedView) {
      return (
        <Redirect to="/group" />
      );
    }
    return this.renderView();
  }
};
const mapStateToProps = (state, ownProps) => {
  // state略号設定
  let ctl = state.pageController;
  let t = state.tournament.composition.tournamentEvent;
  let s = state.tournament.management.subdivisions;
  let pp = state.tournament.composition.participatingPlayers;
  // API error判定
  let error = t.error || s.error || pp.error;
  if(error) return { error };
  // Page表示判定
  let isFetching = t.isFetching || s.isFetching || pp.isFetching;
  let isPermittedView = ctl.gender && ctl.classification && ctl.event && ctl.subdivision && ctl.competitionGroup;
  // 追加propsの設定
  let header = getHeaderProps(state);
  let players = (header.competitionGroup ? header.competitionGroup.players : {}); 
  let additionalProps = {
    error,
    isFetching,
    isPermittedView,
    header,
    players,
    participatingPlayers: pp.players,
  };
  return additionalProps;
};
const mapDispatchToProps = dispatch => {
  return {
    // dispatching plain actions
    changeBibs: (value) => dispatch(pageControllerBibsAction(value)),
    dispatchParticipatingPlayers: (gender, subdivision, group, bibs) => dispatch(participatingPlayersAction(gender, subdivision, group, bibs)),
  }
};

Player.displayName = "Player";
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Player))
