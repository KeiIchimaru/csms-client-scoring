import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Redirect } from 'react-router-dom';
import { connect } from "react-redux";

import { NOT_SELECTED } from "../lib/ulib";
import {
  pageControllerBibsAction,
} from "../redux/actions/pageControllerAction";

class Player extends Component {
  componentDidMount() {
    document.title = '選手選択';
  }
  render() {
    return (
      <>
        {!this.props.isPermittedView ? (
          <Redirect to="/group" />
        ) : (
        <>
          <h2>Player</h2>
          <p>採点を行う選手の選択を行います</p>
          <button onClick={() => this.props.history.push('/group')}>戻る</button>
          <button onClick={() => this.props.history.push('/input')}>次へ</button>
        </>
        )}
      </>
    );
  }
};
const mapStateToProps = (state, ownProps) => {
  // Page表示判定
  let p = state.pageController;
  let isPermittedView = Boolean(p.competitionGroup);

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
    changeBibs: (value) => dispatch(pageControllerBibsAction(value)),
  }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Player))
