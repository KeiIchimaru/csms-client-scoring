import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Redirect } from 'react-router-dom';
import { connect } from "react-redux";

import { NOT_SELECTED, getMessage } from "../lib/ulib";
import { TITLE_SUBDIVISION } from "../lib/messages";

import { getHeaderProps } from "../lib/props/headerProps";

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
    document.title = getMessage(TITLE_SUBDIVISION);
  }
  redirectGroup(subdivision) {
    this.props.changeSubdivision(subdivision);
    this.props.history.push('/group')
  }
  redirectPlayer(subdivision, competitionGroup) {
    this.props.changeSubdivision(subdivision);
    this.props.changeControllerCompetitionGroup(competitionGroup);
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
    const subdivisions = this.props.subdivisions.map((subdivision, index) => 
      <tr key={'competitionGroups_' + index.toString()}>
        <td onClick={e => this.redirectGroup(subdivision.id)}>
          {subdivision.number}({subdivision.name})
        </td>
        <td>
          <div>練習開始:{subdivision.practice_start_time.toString().slice(0,5)}</div>
          <div>演技開始:{subdivision.start_time.toString().slice(0,5)}</div>
          <div>演技終了:{subdivision.end_time.toString().slice(0,5)}</div>
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
    let navi = [ ['戻る', '/'], ];
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
  let error = state.tournament.composition.tournamentEvent.error || state.tournament.management.subdivisions.error;
  if(error) return { error };
  // Page表示判定
  let p = state.pageController;
  let isPermittedView = p.gender && p.classification && p.event;
  // データ設定
  let t = state.tournament.composition.tournamentEvent;
  let s = state.tournament.management.subdivisions;
  // 追加propsの設定
  let additionalProps = {
    error,
    isPermittedView,
    header: getHeaderProps(state),
    gender: p.gender,
    classification: p.classification,
    event: p.event,
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
  }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Subdivision))
