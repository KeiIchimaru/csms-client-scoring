import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Redirect } from 'react-router-dom';
import { connect } from "react-redux";

import { NOT_SELECTED } from "../lib/ulib";
import {
  pageControllerCompetitionGroupAction,
} from "../redux/actions/pageControllerAction";

class Group extends Component {
  componentDidMount() {
    document.title = '組織選択';
  }
  render() {
    return (
      <>
        {!this.props.isPermittedView ? (
          <Redirect to="/subdivision" />
        ) : (
        <>
          <h2>Group</h2>
          <p>採点を行う組織（学校又は都道府県）の選択を行います</p>
          <button onClick={() => this.props.history.push('/subdivision')}>戻る</button>
          <button onClick={() => this.props.history.push('/player')}>次へ</button>
        </>
        )}
      </>
    );
  }
};
const mapStateToProps = (state, ownProps) => {
  // Page表示判定
  let p = state.pageController;
  let isPermittedView = Boolean(p.subdivision);

  // 追加propsの設定
  let additionalProps = {
    isPermittedView,
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
