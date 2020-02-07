import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { connect } from "react-redux";

import { NOT_SELECTED, getMessage } from "../lib/ulib";
import { TITLE_COMPETITION, MSG_REQUIRE_ALL_ITEMS } from "../lib/messages";

import { getHeaderProps } from "../lib/props/headerProps";

// Redux Action
import {
  pageInitializeCompetitionAction,
  pageControllerGenderAction,
  pageControllerClassificationAction,
  pageControllerEventAction
} from "../redux/actions/pageControllerAction";
import {
  subdivisionsAction,
} from "../redux/actions/tournament/management/subdivisionsAction";

// Redux Reducer Function

// React Component
import Error from "../components/presentational/error";
import Loading from "../components/presentational/loading";
import SelectItem from "../components/presentational/selectItem";
import ContentHeader from "../components/presentational/contentHeader"

// Main
class Competition extends Component { 
  componentDidMount() {
    document.title = getMessage(TITLE_COMPETITION);
  }
  checkNext(e) {
    if(this.props.gender && this.props.classification && this.props.event) {
      this.props.getSubdivisions(this.props.gender, this.props.classification);
      this.props.history.push('/subdivision');
    } else {
      this.props.alert.show(getMessage(MSG_REQUIRE_ALL_ITEMS));
    }
  }
  renderView() {
    return (
      <>
        <ContentHeader header={this.props.header} />
        <div className="content-body">
          <SelectItem name="gender" value={this.props.gender} items={this.props.genderItems} change={this.props.changeGender} />
          <SelectItem name="event" value={this.props.event} items={this.props.eventItems} change={this.props.changeEvent} />
        </div>
        <div  className="content-footer">
          <button onClick={e => this.checkNext(e)}>次へ</button>
        </div>
      </>
    );
  };
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
    return this.renderView();
  }
}
// for React-Redux
const mapStateToProps = (state, ownProps) => {
  let error = state.tournament.composition.tournamentEvent.error;
  if(error) return { error };
  // 以下の内容がpropsに追加される。（更新不可）
  // 第２引数にownPropsを指定できるが、ownPropsの内容でadditionalPropsの内容を変えたい場合に指定する。（additionalPropsはpropsに追加される）
  let p = state.pageController;
  let t = state.tournament.composition.tournamentEvent;
  let eventItems = [];
  if(p.gender != NOT_SELECTED){
    let classification = p.classification;
    let classifications = t.events[state.pageController.gender];
    let keys = Object.keys(classifications);
    if(keys.length == 1 && p.classification == NOT_SELECTED) {
      classification = keys[0];
      // ここでdispatchしてclassificationの設定依頼を行う。(state.pageController.classificationはNOT_SELECTEDのまま)
      // ここでdispatchしても再描画は行われない。
      ownProps.dispatch(pageControllerClassificationAction(classification));
    }
    if(classification != NOT_SELECTED){
      let events = classifications[classification];
      events.forEach((row) => {
        eventItems.push([row.id, row.name]);
      });
    }
  }
  let additionalProps = {
    error,
    isFetching: t.isFetching,
    header: getHeaderProps(state),
    gender: p.gender,
    classification: p.classification,
    event: p.event,
    genderItems: t.genders,
    eventItems,
  }
  return additionalProps;
};
const mapDispatchToProps = dispatch => {
  dispatch(pageInitializeCompetitionAction());
  return {
    // dispatching plain actions
    changeGender: (value) => dispatch(pageControllerGenderAction(value)),
    changeEvent: (value) => dispatch(pageControllerEventAction(value)),
    getSubdivisions: (gender, classification) => dispatch(subdivisionsAction(gender, classification)),
  }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Competition))
