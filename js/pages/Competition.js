import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Redirect } from 'react-router-dom';
import { connect } from "react-redux";

import { NOT_SELECTED } from "../lib/constant";
import { getMessage } from "../lib/ulib";
import { getHeaderProps, getStateError, getFetching } from "../lib/propsLib";
import * as msg from "../lib/messages";

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
    document.title = getMessage(msg.TITLE_COMPETITION);
  }
  checkNext(e) {
    if(this.props.gender && this.props.classification && this.props.event) {
      if(document.getElementById('save').checked) {
        localStorage.setItem('gender', this.props.gender);
        localStorage.setItem('classification', this.props.classification);
        localStorage.setItem('event', this.props.event);  
      } else {
        localStorage.removeItem('gender');
        localStorage.removeItem('classification');
        localStorage.removeItem('event');
      }
      this.props.getSubdivisions(this.props.gender, this.props.classification, this.props.event);
      this.props.history.push('/subdivision');
    } else {
      this.props.alert.show(getMessage(msg.MSG_REQUIRE_ALL_ITEMS));
    }
  }
  renderView() {
    return (
      <div className="competition">
        <ContentHeader header={this.props.header} />
        <div className="content-body">
          <h2>採点する競技を選択して下さい。</h2>
          <div>
            性別：<SelectItem name="gender" value={this.props.gender} items={this.props.genderItems} onChange={this.props.changeGender} />
          </div>
          <div>
            競技：<SelectItem name="event" value={this.props.event} items={this.props.eventItems} onChange={this.props.changeEvent} />
          </div>
          <div>
            <input type="checkbox" id="save" defaultChecked /><label htmlFor="save">設定を保存する</label>
            <button type="button" className="ml-5 btn-secondary" onClick={e => this.checkNext(e)}>決定</button>
          </div>
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
    if(this.props.isSkipView) {
      return (
        <Redirect to="/subdivision" />
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
  let error = getStateError(state);
  if(error) return { error };
  // API call?
  let isFetching = getFetching(state);
  if(isFetching) return { error, isFetching }
  // Page表示判定
  let isSkipView = false;
  if(ctl.isFirstTime) {
    const gender = localStorage.getItem('gender');
    const classification = localStorage.getItem('classification');
    const event = localStorage.getItem('event');
    if(gender && classification && event) {
      isSkipView = true;
      ownProps.dispatch(pageControllerGenderAction(gender));
      ownProps.dispatch(pageControllerClassificationAction(classification));
      ownProps.dispatch(pageControllerEventAction(event));
      ownProps.dispatch(subdivisionsAction(gender, classification, event));
      return { error, isFetching, isSkipView }
    }  
  }
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
    isSkipView,
    tournament: state.tournament.composition.tournament,
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
