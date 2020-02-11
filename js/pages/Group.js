import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Redirect } from 'react-router-dom';
import { connect } from "react-redux";

import { NOT_SELECTED, getMessage } from "../lib/ulib";
import { TITLE_COMPETITION, TITLE_SUBDIVISION, TITLE_GROUP } from "../lib/messages";

// React Component
import { getHeaderProps } from "../lib/props/headerProps";

// Redux Action
import {
  pageInitializeCompetitionGroupAction,
  pageControllerCompetitionGroupAction,
} from "../redux/actions/pageControllerAction";

// React Component
import Error from "../components/presentational/error";
import Loading from "../components/presentational/loading";
import ContentHeader from "../components/presentational/contentHeader";
import ContentnNavi from "../components/presentational/contentnNavi";

// Main
class Group extends Component {
  componentDidMount() {
    document.title = getMessage(TITLE_GROUP);
  }
  renderView() {
    let maxPlayerNumber = 0;
    this.props.competitionGroups.forEach(group => {
      if(group.players.length > maxPlayerNumber) {
        maxPlayerNumber = group.players.length;
      }
    });
    const players = (parent_index, players) => {
      const result = players.map((player, index) => {
        let entryPlayer = this.props.players[player.bibs];
        return (
          <div key={`${Group.displayName}_${parent_index}_${index}`} className="d-inline-block border">
            {player.bibs}:{entryPlayer.player_name}
          </div>
        )
      });
      if(result.length < maxPlayerNumber) {
        for(let index = result.length ; index < maxPlayerNumber; index++) {
          result.push(
            <div key={`${Group.displayName}_${parent_index}_${index}`} className="d-inline-block border">&nbsp;</div>
          );
        }
      }
      return result;
    }
    const competitionGroups = this.props.competitionGroups.map((group, index) =>
      <tr key={`${Group.displayName}_${index}`}>
          <td>
            {`${group.number}(${group.name})`}
          </td>
          <td>
            {players(index, group.players)}
          </td>
      </tr>
    );
    let navi = [
      [getMessage(TITLE_COMPETITION), "/"],
      [getMessage(TITLE_SUBDIVISION), "/subdivision"],
    ];
    return (
    <>
      <ContentHeader header={this.props.header} />
      <ContentnNavi navi={navi} history={this.props.history} />
      <div className="content-body">
        <table className="w-100">
          <thead>
            <tr><th className="w-25">組</th><th>選手</th></tr>
          </thead>
          <tbody>
            {competitionGroups}
          </tbody>
        </table>
      </div>
      <div  className="content-footer">
      </div>
    </>
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
  let competitionGroups;
  for(let i = 0; i < s.data.length; i++) {
    if(s.data[i].id == ctl.subdivision) {
      competitionGroups = s.data[i].competitionGroups;
      break;
    }
  }
  let additionalProps = {
    error,
    isFetching,
    isPermittedView,
    header: getHeaderProps(state),
    subdivisions: s.data,
    competitionGroups,
    players: p.data,
  };
  return additionalProps;
};
const mapDispatchToProps = dispatch => {
  dispatch(pageInitializeCompetitionGroupAction());
  return {
    // dispatching plain actions
    changeGroup: (value) => dispatch(pageControllerCompetitionGroupAction(value)),
  }
};

Group.displayName = "Group";
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Group))
