import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Redirect } from 'react-router-dom';
import { connect } from "react-redux";

import { NOT_SELECTED, getMessage } from "../lib/ulib";
import { TITLE_GROUP } from "../lib/messages";

import { getHeaderProps } from "../lib/props/headerProps";

// Redux Action
import {
  pageControllerCompetitionGroupAction,
} from "../redux/actions/pageControllerAction";

// React Component
import Error from "../components/presentational/error";
import ContentHeader from "../components/presentational/contentHeader";
import ContentnNavi from "../components/presentational/contentnNavi";

// Main
class Group extends Component {
  componentDidMount() {
    document.title = getMessage(TITLE_GROUP);
  }
  renderView() {
    let navi = [ ["競技選択", "/"], ["戻る", "/subdivision"], ];
    return (
    <>
      <ContentHeader header={this.props.header} />
      <ContentnNavi navi={navi} history={this.props.history} />
      <p>採点を行う組織（学校又は都道府県）の選択を行います</p>
    </>
    )
  }
  render() {
    if(this.props.error) {
      return (
        <Error error={this.props.error} />
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
  let error = state.tournament.composition.tournamentEvent.error;
  if(error) return { error };
  // Page表示判定
  let p = state.pageController;
  let isPermittedView = Boolean(p.subdivision);

  // 追加propsの設定
  let additionalProps = {
    isPermittedView,
    header: getHeaderProps(state),
  };
  return additionalProps;
};
const mapDispatchToProps = dispatch => {
  return {
    // dispatching plain actions
    changeGroup: (value) => dispatch(pageControllerCompetitionGroupAction(value)),
  }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Group))
