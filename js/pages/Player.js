import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Redirect } from 'react-router-dom';
import { connect } from "react-redux";

import { getMessage } from "../lib/ulib";
import { getHeaderProps, getStateError, getFetching, isValidityPlayer } from "../lib/propsLib";
import * as msg from "../lib/messages";

// Redux Action
import {
  pageControllerBibsAction,
} from "../redux/actions/pageControllerAction";
import {
  participatingPlayersAction,
} from "../redux/actions/tournament/composition/participatingPlayersAction";

// React Component
import Error from "../components/presentational/error";
import Loading from "../components/presentational/loading";
import ContentHeader from "../components/presentational/contentHeader";
import ContentnNavi from "../components/presentational/contentnNavi";
import ParticipatingPlayer from "../components/presentational/participatingPlayer";

class Player extends Component {
  constructor(props) {
    super(props);
    // 参照：https://qiita.com/konojunya/items/fc0cfa6a56821e709065
    this.redirectInput = this.redirectInput.bind(this);
  }
  componentDidMount() {
    document.title = getMessage(msg.TITLE_PLAYER);
    let h = this.props.header;
    // ブラウザのリロードを押された場合、stateはクリアされる。(redirectの前にcallされる)
    if(h.day) {
      this.props.dispatchParticipatingPlayers(h.gender, h.subdivision.id, h.competitionGroup.id);
    }
  }
  redirectInput(bibs) {
    this.props.changeBibs(bibs);
    this.props.history.push('/input')
  }
  renderView() {
    let numberOfPlayer = 0;
    let numberOfActed = 0;
    let teamScore = 0.0;
    const players = this.props.players.map((p, i) => {
      let pp = this.props.participatingPlayers[p.bibs];
      let validity = isValidityPlayer(pp);
      let style = (validity ? null : "abstention" );
      if(validity) {
        numberOfPlayer += 1;
        let score = pp.scores[this.props.header.event]
        if(score) {
          numberOfActed += 1;
          teamScore += score.event_score;
        }
      }
      return (
      <tr key={`${Player.displayName}_${i}`} className={style} >
        <ParticipatingPlayer event={this.props.header.event} player={p} participatingPlayer={pp} onClick={this.redirectInput} />
      </tr>
      )
    });
    // チーム得点

    // 承認ボタンの表示
    let confirmBox;
    if(numberOfPlayer > 0 && numberOfPlayer == numberOfActed) {
      confirmBox = (
        <div>
          <label>
            <input type="checkbox" name="confirm" />{getMessage(msg.MSG_CONFIRM)}
          </label>
          <button type="button" className="btn-secondary" onClick={e => this.checkNext(e)}>{getMessage(msg.TXT_REGISTER)}</button>
        </div>
      );
    }
    let navi = [
      [getMessage(msg.TITLE_COMPETITION), "/"],
      [getMessage(msg.TITLE_SUBDIVISION), "/subdivision"],
      [getMessage(msg.TITLE_GROUP), "/group"],
    ];
    return (
      <div className="player">
        <ContentHeader header={this.props.header} />
        <ContentnNavi navi={navi} history={this.props.history} />
        <div className="content-body">
          <table className="w-100">
            <thead>
              <tr>
                <th className="boderLeft2">番</th>
                <th>氏名</th>
                <th className="actingOrderTitle">演技順</th>
                <th className="boderLeft2">D2</th>
                <th>D1</th>
                <th className="boderLeft2">E1</th>
                <th>E2</th>
                <th>E3</th>
                <th>E4</th>
                <th className="boderLeft2">E計</th>
                <th>合計</th>
                <th>減点</th>
                <th className="boderLeft2 boderRight2">決定点</th>
              </tr>
            </thead>
            <tbody>
              {players}
              <tr>
                <td className="teamTotalNull" colSpan="9"></td>
                <td className="teamTotalLabel" colSpan="3">チーム得点</td>
                <td className="teamTotal">{teamScore}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="content-footer">
          {confirmBox}
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
  let pp = state.tournament.composition.participatingPlayers;
  // API error判定
  let error = getStateError(state);
  if(error) return { error };
  // Page表示判定
  let isFetching = getFetching(state);
  let isPermittedView = ctl.gender && ctl.classification && ctl.event && ctl.subdivision && ctl.competitionGroup;
  // 追加propsの設定
  let header = getHeaderProps(state);
  let players = (header.competitionGroup ? header.competitionGroup.players : {}); 
  let additionalProps = {
    error,
    isFetching,
    isPermittedView,
    header,
    players,
    participatingPlayers: pp.players,
  };
  return additionalProps;
};
const mapDispatchToProps = dispatch => {
  return {
    // dispatching plain actions
    changeBibs: (value) => dispatch(pageControllerBibsAction(value)),
    dispatchParticipatingPlayers: (gender, subdivision, group, bibs) => dispatch(participatingPlayersAction(gender, subdivision, group, bibs)),
  }
};

Player.displayName = "Player";
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Player))
