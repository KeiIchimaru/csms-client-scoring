import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Redirect } from 'react-router-dom';
import { connect } from "react-redux";

import { getMessage, getDisplayTime } from "../lib/ulib";
import { TITLE_COMPETITION, TITLE_SUBDIVISION } from "../lib/messages";

import { getHeaderProps } from "../lib/props/headerProps";

// Redux Action
import {
  pageInitializeSubdivisionAction,
  pageControllerSubdivisionAction,
  pageControllerCompetitionGroupAction,
} from "../redux/actions/pageControllerAction";
import {
  participatingPlayersAction,
} from "../redux/actions/tournament/composition/participatingPlayersAction";

// React Component
import Error from "../components/presentational/error";
import Loading from "../components/presentational/loading";
import ContentHeader from "../components/presentational/contentHeader";
import ContentnNavi from "../components/presentational/contentnNavi";

// Main
class Subdivision extends Component {
  componentDidMount() {
    document.title = getMessage(TITLE_SUBDIVISION);
  }
  redirectGroup(subdivision) {
    this.props.changeSubdivision(subdivision);
    this.props.participatingPlayers(this.props.gender, subdivision);
    this.props.history.push('/group')
  }
  redirectPlayer(subdivision, competitionGroup) {
    this.props.changeSubdivision(subdivision);
    this.props.changeControllerCompetitionGroup(competitionGroup);
    this.props.participatingPlayers(this.props.gender, subdivision, competitionGroup);
    this.props.history.push('/player')
  }
  renderView() {
    // 組の表示
    const groups = (parent_index, subdivision_id, competitionGroups) => {
      const result = competitionGroups.map((competitionGroup, index) => 
      <tr key={'competitionGroups_' + parent_index + '_' + index.toString()}>
        <td onClick={e => this.redirectPlayer(subdivision_id, competitionGroup.id)}>
          {competitionGroup.number}({competitionGroup.name})
        </td>
      </tr>
      );
      return result;
    };
    // 班の表示
    // map() メソッドは、与えられた関数を配列のすべての要素に対して呼び出し、その結果からなる新しい配列を生成します。
    const subdivisions = this.props.subdivisions.map((subdivision, index) => 
      <tr key={'competitionGroups_' + index.toString()}>
        <td onClick={e => this.redirectGroup(subdivision.id)}>
          {subdivision.number}({subdivision.name})
        </td>
        <td>
          <div>練習開始:{getDisplayTime(subdivision.practice_start_time)}</div>
          <div>演技開始:{getDisplayTime(subdivision.start_time)}</div>
          <div>演技終了:{getDisplayTime(subdivision.end_time)}</div>
        </td>
        <td>
          <table>
            <tbody>
              {groups(index.toString(), subdivision.id, subdivision.competitionGroups)}
            </tbody>
          </table>
        </td>
      </tr>
    );
    let navi = [
      [getMessage(TITLE_COMPETITION), '/'],
    ];
    return (
    <>
      <ContentHeader header={this.props.header} />
      <ContentnNavi navi={navi} history={this.props.history} />
      <div className="content-body">
        <table>
          <thead>
            <tr><th>班</th><th>演技時間</th><th>組</th></tr>
          </thead>
          <tbody>
            {subdivisions}
          </tbody>
        </table>
      </div>
      <div  className="content-footer">
      </div>
    </>
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
        <Redirect to="/" />
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
  // API error判定
  let error = t.error || s.error;
  if(error) return { error };
  // Page表示判定
  let isFetching = t.isFetching || s.isFetching;
  let isPermittedView = ctl.gender && ctl.classification && ctl.event;
  // 追加propsの設定
  let additionalProps = {
    error,
    isFetching,
    isPermittedView,
    header: getHeaderProps(state),
    gender: ctl.gender,
    classification: ctl.classification,
    event: ctl.event,
    subdivisions: s.data,
  };
  return additionalProps;
};
const mapDispatchToProps = dispatch => {
  dispatch(pageInitializeSubdivisionAction());
  return {
    // dispatching plain actions
    changeSubdivision: (value) => dispatch(pageControllerSubdivisionAction(value)),
    changeControllerCompetitionGroup: (value) => dispatch(pageControllerCompetitionGroupAction(value)),
    participatingPlayers: (gender, subdivision, group) => dispatch(participatingPlayersAction(gender, subdivision, group)),
  }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Subdivision))
