import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Redirect } from 'react-router-dom';
import { connect } from "react-redux";

import { getMessage, getOrganizationName } from "../lib/ulib";
import { getHeaderProps, getStateError, getFetching } from "../lib/propsLib";
import * as msg from "../lib/messages";

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
  constructor() {
    super();
    // 参照：https://qiita.com/konojunya/items/fc0cfa6a56821e709065
    this.redirectInput = this.redirectInput.bind(this);
  }
  componentDidMount() {
    document.title = getMessage(msg.TITLE_GROUP);
    let h = this.props.header;
    // ブラウザのリロードを押された場合、stateはクリアされる。(redirectの前にcallされる)
    if(h.day) {
      this.props.dispatchParticipatingPlayers(h.gender, h.subdivision.id);
    }
  }
  redirectPlayer(competitionGroup) {
    this.props.changeCompetitionGroup(competitionGroup);
    this.props.history.push('/player')
  }
  redirectInput(competitionGroup, bibs) {
    let h = this.props.header;
    this.props.changeCompetitionGroup(competitionGroup);
    this.props.changeBibs(bibs);
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
      competitionGroup.players.map((player, j) => {
        let scoreStyle = null;
        return (
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
            <ParticipatingPlayer event={this.props.header.event} competitionGroup={competitionGroup.id} player={player} participatingPlayer={this.props.participatingPlayers[player.bibs]} onClick={this.redirectInput} scoreStyle={scoreStyle} isShort={true} />
          </tr>
        );
      })
    );
    let navi = [
      [getMessage(msg.TITLE_COMPETITION), "/"],
      [getMessage(msg.TITLE_SUBDIVISION), "/subdivision"],
    ];
    return (
    <div className="group">
      <ContentHeader header={this.props.header} />
      <ContentnNavi navi={navi} history={this.props.history} />
      <div className="content-body">
        <table className="w-100">
          <thead>
            <tr>
              <th rowSpan="2" className="competitionGroup">{getMessage(msg.TXT_COMPETITION_GROUP)}</th>
              <th rowSpan="2">{getMessage(msg.TXT_ORGANIZATION_NAME)}</th>
              <th colSpan="4">{getMessage(msg.TXT_PLAYER)}</th>
            </tr>
            <tr>
              <th>{getMessage(msg.TXT_BIBS)}</th>
              <th>{getMessage(msg.TXT_NAME)}</th>
              <th className="actingOrderTitle">{getMessage(msg.TXT_ACTING_ORDER)}</th>
              <th>{getMessage(msg.TXT_SCORE)}</th>
            </tr>
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
  let pp = state.tournament.composition.participatingPlayers;
  // API error判定
  let error = getStateError(state);
  if(error) return { error };
  // Page表示判定
  let isFetching = getFetching(state);
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
    participatingPlayers: pp.players,
  };
  return additionalProps;
};
const mapDispatchToProps = dispatch => {
  dispatch(pageInitializeCompetitionGroupAction());
  return {
    // dispatching plain actions
    changeCompetitionGroup: (value) => dispatch(pageControllerCompetitionGroupAction(value)),
    changeBibs: (value) => dispatch(pageControllerBibsAction(value)),
    dispatchParticipatingPlayers: (gender, subdivision, group, bibs) => dispatch(participatingPlayersAction(gender, subdivision, group, bibs)),
  }
};

Group.displayName = "Group";
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Group))
