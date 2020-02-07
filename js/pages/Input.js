import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Redirect } from 'react-router-dom';
import { connect } from "react-redux";

import { NOT_SELECTED } from "../lib/ulib";

class Input extends Component {
  componentDidMount() {
    document.title = '採点入力';
  }
  render() {
    return (
      <>
        {!this.props.isPermittedView ? (
          <Redirect to="/player" />
        ) : (
        <>
          <h2>Input</h2>
          <p>採点の入力を行います</p>
          <button onClick={() => this.props.history.push('/player')}>戻る</button>
        </>
        )}
      </>
    );
  }
};
const mapStateToProps = (state, ownProps) => {
  // Page表示判定
  let p = state.pageController;
  let isPermittedView = Boolean(p.bibs);

  // 追加propsの設定
  let additionalProps = {
    isPermittedView,
  };
  return additionalProps;
};
const mapDispatchToProps = dispatch => {
  return {
    // dispatching plain actions
  }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Input))
