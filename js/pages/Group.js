import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Redirect } from 'react-router-dom';
import { connect } from "react-redux";

import { NOT_SELECTED, getMessage, getOrganizationName } from "../lib/ulib";
import { TITLE_COMPETITION, TITLE_SUBDIVISION, TITLE_GROUP } from "../lib/messages";
import { getHeaderProps } from "../lib/props/headerProps";

// Redux Action
import {
  pageInitializeCompetitionGroupAction,
  pageControllerCompetitionGroupAction,
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

// Main
class Group extends Component {
  componentDidMount() {
    document.title = getMessage(TITLE_GROUP);
  }
  redirectPlayer(competitionGroup) {
    this.props.changeCompetitionGroup(competitionGroup);
    this.props.dispatchParticipatingPlayers(this.props.header.gender, this.props.header.subdivision.id, competitionGroup);
    this.props.history.push('/player')
  }
  redirectInput(competitionGroup, bibs) {
    let h = this.props.header;
    this.props.changeCompetitionGroup(competitionGroup);
    this.props.changeBibs(bibs);
    this.props.dispatchParticipatingPlayers(h.gender, h.subdivision.id, competitionGroup, bibs);
    this.props.history.push('/input')
  }
  renderView() {
    let maxPlayerNumber = 0;
    this.props.competitionGroups.forEach(group => {
      if(group.players.length > maxPlayerNumber) {
        maxPlayerNumber = group.players.length;
      }
    });
    const competitionGroups = this.props.competitionGroups.map((competitionGroup, i) => 
      competitionGroup.players.map((player, j) => 
        <tr key={`${Group.displayName}_${i}_${j}`}>
          {j == 0 &&
            <>
              <td className="linkPlayer" rowSpan={competitionGroup.players.length} onClick={e => this.redirectPlayer(competitionGroup.id)}>
                {competitionGroup.number}
              </td>
              <td className="organizationName" rowSpan={competitionGroup.players.length}>
                {getOrganizationName(competitionGroup.organization_name)}
              </td>
            </>
          }
          <ParticipatingPlayer event={this.props.header.event} competitionGroup={competitionGroup.id} player={player} participatingPlayer={this.props.participatingPlayers[player.bibs]} onClick={this.redirectInput} isShort={true} />
        </tr>
      )
    );
    let navi = [
      [getMessage(TITLE_COMPETITION), "/"],
      [getMessage(TITLE_SUBDIVISION), "/subdivision"],
    ];
    return (
    <div className="group">
      <ContentHeader header={this.props.header} />
      <ContentnNavi navi={navi} history={this.props.history} />
      <div className="content-body">
        <table className="w-100">
          <thead>
            <tr><th rowSpan="2" className="competitionGroup">組</th><th rowSpan="2">学校名</th><th colSpan="4">選手</th></tr>
            <tr><th>番</th><th>氏名</th><th className="actingOrderTitle">演技順</th><th>得点</th></tr>
          </thead>
          <tbody>
            {competitionGroups}
          </tbody>
        </table>
      </div>
      <div  className="content-footer">
      </div>
    </div>
    )
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
        <Redirect to="/subdivision" />
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
  let isPermittedView = ctl.gender && ctl.classification && ctl.event && ctl.subdivision;
  // 追加propsの設定
  let header = getHeaderProps(state);
  let competitionGroups = (header.subdivision ? header.subdivision.competitionGroups : {}); 
  let additionalProps = {
    error,
    isFetching,
    isPermittedView,
    header,
    competitionGroups,
    participatingPlayers: p.data,
  };
  return additionalProps;
};
const mapDispatchToProps = dispatch => {
  dispatch(pageInitializeCompetitionGroupAction());
  return {
    // dispatching plain actions
    changeCompetitionGroup: (value) => dispatch(pageControllerCompetitionGroupAction(value)),
    changeBibs: (value) => dispatch(pageControllerBibsAction(value)),
    dispatchParticipatingPlayers: (gender, subdivision, group) => dispatch(participatingPlayersAction(gender, subdivision, group)),
  }
};

Group.displayName = "Group";
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Group))
