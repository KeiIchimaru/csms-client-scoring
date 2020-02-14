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
import ContentHeader from "../components/presentational/contentHeader"
import SelectItem from "../components/presentational/selectItem";

// Main
class Competition extends Component { 
  componentDidMount() {
    document.title = getMessage(TITLE_COMPETITION);
  }
  checkNext(e) {
    if(this.props.gender && this.props.classification && this.props.event) {
      this.props.getSubdivisions(this.props.gender, this.props.classification, this.props.event);
      this.props.history.push('/subdivision');
    } else {
      this.props.alert.show(getMessage(MSG_REQUIRE_ALL_ITEMS));
    }
  }
  renderView() {
    return (
      <div className="competition">
        <ContentHeader header={this.props.header} />
        <div className="content-body">
          <h2>採点する競技を選択して下さい。</h2>
          <div>
            <SelectItem name="gender" value={this.props.gender} items={this.props.genderItems} change={this.props.changeGender} />
            <SelectItem name="event" value={this.props.event} items={this.props.eventItems} change={this.props.changeEvent} />
          </div>
          <button type="button" className="btn-secondary" onClick={e => this.checkNext(e)}>決定</button>
        </div>
        <div  className="content-footer">
        </div>
      </div>
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
  // state略号設定
  let ctl = state.pageController;
  let t = state.tournament.composition.tournamentEvent;
  // API error判定
  let error = t.error;
  if(error) return { error };
  // Page表示判定
  let isFetching = t.isFetching;
  let isPermittedView = true;
  // 以下の内容がpropsに追加される。（更新不可）
  // 第２引数にownPropsを指定できるが、ownPropsの内容でadditionalPropsの内容を変えたい場合に指定する。（additionalPropsはpropsに追加される）
  let classification = ctl.classification;
  let event = ctl.event;
  let eventItems = [];
  if(ctl.gender != NOT_SELECTED){
    let classifications = t.events[ctl.gender];
    let keys = Object.keys(classifications);
    if(keys.length == 1 && ctl.classification == NOT_SELECTED) {
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
    isFetching,
    isPermittedView,
    header: getHeaderProps(state),
    gender: ctl.gender,
    classification,
    event,
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
    getSubdivisions: (gender, classification, event) => dispatch(subdivisionsAction(gender, classification, event)),
  }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Competition))
