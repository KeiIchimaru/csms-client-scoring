import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Redirect } from 'react-router-dom';
import { connect } from "react-redux";

import { NOT_SELECTED, getMessage } from "../lib/ulib";
import { TITLE_COMPETITION, TITLE_SUBDIVISION, TITLE_GROUP } from "../lib/messages";
import { getHeaderProps } from "../lib/props/headerProps";

// Redux Action
import {
  pageControllerBibsAction,
} from "../redux/actions/pageControllerAction";

// React Component
import Error from "../components/presentational/error";
import Loading from "../components/presentational/loading";
import ContentHeader from "../components/presentational/contentHeader";
import ContentnNavi from "../components/presentational/contentnNavi";
import ParticipatingPlayer from "../components/presentational/participatingPlayer";

class Player extends Component {
  componentDidMount() {
    document.title = '選手選択';
  }
  renderView() {
    const players = this.props.players.map((player, i) => 
      <tr key={`${Player.displayName}_${i}`}>
        <ParticipatingPlayer participatingPlayer={this.props.participatingPlayers[player.bibs]} />
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
              <tr><th>ビブス</th><th>氏名</th><th>得点</th></tr>
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
  let p = state.tournament.composition.participatingPlayers;
  // API error判定
  let error = t.error || s.error || p.error;
  if(error) return { error };
  // Page表示判定
  let isFetching = t.isFetching || s.isFetching || p.isFetching;
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
    participatingPlayers: p.data,
  };
  return additionalProps;
};
const mapDispatchToProps = dispatch => {
  return {
    // dispatching plain actions
    changeBibs: (value) => dispatch(pageControllerBibsAction(value)),
  }
};

Player.displayName = "Player";
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Player))
