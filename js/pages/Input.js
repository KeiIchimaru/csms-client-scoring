import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Redirect } from 'react-router-dom';
import { connect } from "react-redux";

import { NOT_SELECTED, getMessage } from "../lib/ulib";
import { TXT_CANCEL, TXT_RETURN } from "../lib/messages";
import { getHeaderProps } from "../lib/props/headerProps";

// React Component
import Error from "../components/presentational/error";
import Loading from "../components/presentational/loading";
import ContentHeader from "../components/presentational/contentHeader";
import ContentnNavi from "../components/presentational/contentnNavi";

class Input extends Component {
  componentDidMount() {
    document.title = '採点入力';
  }
  renderView() {
    let navi = [
      [getMessage(TXT_CANCEL), "/player"],
      [getMessage(TXT_RETURN), "/player"],
    ];
    return (
      <div className="input">
        <ContentHeader header={this.props.header} />
        <ContentnNavi navi={navi} history={this.props.history} />
        <div className="content-body">
        <table className="w-100">
            <thead>
              <tr>
                <th className="boderLeft2">D2</th>
                <th>D1</th>
                <th className="boderLeft2">E1</th>
                <th>E2</th>
                <th>E3</th>
                <th>E4</th>
                <th className="boderLeft2">E計</th>
                <th>合計</th>
                <th>減点</th>
                <th className="boderLeft2">決定点</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><input type="number" name="d2" min="0" max="100" step="0.1" /></td>
                <td><input type="number" name="d1" min="0" max="100" step="0.1" /></td>
                <td><input type="number" name="e1" min="0" max="100" step="0.1" /></td>
                <td><input type="number" name="e2" min="0" max="100" step="0.1" /></td>
                <td><input type="number" name="e3" min="0" max="100" step="0.1" /></td>
                <td><input type="number" name="e4" min="0" max="100" step="0.1" /></td>
                <td></td>
                <td></td>
                <td><input type="number" name="penalty" min="0" max="100" step="0.1" /></td>
                <td></td>
              </tr>
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
        <Redirect to="/group" />
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
  let p = state.tournament.composition.participatingPlayers;
  // API error判定
  let error = t.error || s.error || p.error;
  if(error) return { error };
  // Page表示判定
  let isFetching = t.isFetching || s.isFetching || p.isFetching;
  let isPermittedView = ctl.gender && ctl.classification && ctl.event && ctl.subdivision && ctl.competitionGroup && ctl.bibs;
  // 追加propsの設定
  let header = getHeaderProps(state);
  let additionalProps = {
    error,
    isFetching,
    isPermittedView,
    header,
  };
  return additionalProps;
};
const mapDispatchToProps = dispatch => {
  return {
    // dispatching plain actions
  }
};

Input.displayName = "Input";
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Input))
