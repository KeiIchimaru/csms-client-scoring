import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Redirect } from 'react-router-dom';
import { connect } from "react-redux";

import {
  getMessage,
  getDisplayTime,
  getOrganizationName
} from "../lib/ulib";
import {
  getHeaderProps,
  getStateError,
  getFetching
} from "../lib/propsLib";
import * as msg from "../lib/messages";

// Redux Action
import {
  pageInitializeSubdivisionAction,
  pageControllerSubdivisionAction,
  pageControllerCompetitionGroupAction,
} from "../redux/actions/pageControllerAction";

// React Component
import Error from "../components/presentational/error";
import Loading from "../components/presentational/loading";
import ContentHeader from "../components/presentational/contentHeader";
import ContentnNavi from "../components/presentational/contentnNavi";

// Main
class Subdivision extends Component {
  componentDidMount() {
    document.title = getMessage(msg.TITLE_SUBDIVISION);
  }
  redirectGroup(subdivision) {
    this.props.changeSubdivision(subdivision);
    this.props.history.push('/group')
  }
  redirectPlayer(subdivision, competitionGroup) {
    this.props.changeSubdivision(subdivision);
    this.props.changeCompetitionGroup(competitionGroup);
    this.props.history.push('/player')
  }
  renderView() {
    // 組の表示
    const htmlGroup = (subdivision_id, competitionGroup) => {
      return (
      <>
        <td className="linkPlayer" onClick={e => this.redirectPlayer(subdivision_id, competitionGroup.id)}>
          {competitionGroup.number}
        </td>
        <td className="organizationName">
          {getOrganizationName(competitionGroup.organization_name)}
        </td>
        <td>
          {Object.keys(competitionGroup.players).length}人
        </td>
      </>
    )};
    // 班の表示
    // map() メソッドは、与えられた関数を配列のすべての要素に対して呼び出し、その結果からなる新しい配列を生成します。
    const htmlSubdivisions = this.props.subdivisions.map((subdivision, i) =>
      subdivision.competitionGroups.map((competitionGroup, j) => 
        <tr key={`${Subdivision.displayName}_${i}_${j}`}>
          {j == 0 &&
            <>
              <td className="linkGroup" rowSpan={subdivision.competitionGroups.length} onClick={e => this.redirectGroup(subdivision.id)}>
                {subdivision.number}
              </td>
              <td className="actingTime" rowSpan={subdivision.competitionGroups.length}>
                <div>練習開始:{getDisplayTime(subdivision.practice_start_time)}</div>
                <div>演技開始:{getDisplayTime(subdivision.start_time)}</div>
                <div>演技終了:{getDisplayTime(subdivision.end_time)}</div>
              </td>
            </>
          }
          {htmlGroup(subdivision.id, competitionGroup)}
        </tr>
      )
    );
    let navi = [
      [getMessage(msg.TITLE_COMPETITION), '/'],
    ];
    return (
    <div className="subdivision">
      <ContentHeader header={this.props.header} />
      <ContentnNavi navi={navi} history={this.props.history} />
      <div className="content-body">
        <table>
          <thead>
            <tr><th>班</th><th>演技時間</th><th>組</th><th>学校名</th><th>選手</th></tr>
          </thead>
          <tbody>
            {htmlSubdivisions}
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
  let error = getStateError(state);
  if(error) return { error };
  // Page表示判定
  let isFetching = getFetching(state);
  let isPermittedView = ctl.gender && ctl.classification && ctl.event;
  // 追加propsの設定
  let header = getHeaderProps(state);
  let additionalProps = {
    error,
    isFetching,
    isPermittedView,
    tournament: state.tournament.composition.tournament,
    header,
    subdivisions: s.data,
  };
  return additionalProps;
};
const mapDispatchToProps = dispatch => {
  dispatch(pageInitializeSubdivisionAction());
  return {
    // dispatching plain actions
    changeSubdivision: (value) => dispatch(pageControllerSubdivisionAction(value)),
    changeCompetitionGroup: (value) => dispatch(pageControllerCompetitionGroupAction(value)),
  }
};

Subdivision.displayName = "Subdivision";
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Subdivision))
