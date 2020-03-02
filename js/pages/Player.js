import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Redirect } from 'react-router-dom';
import { connect } from "react-redux";

import { getMessage } from "../lib/ulib";
import {
  CSS_TOP_NUMBER,
  getHeaderProps,
  getStateError,
  getFetching,
  isValidityPlayer,
  isTopNumber,
  getEventTeamScore
} from "../lib/propsLib";
import * as msg from "../lib/messages";

// Redux Action
import { pageControllerBibsAction } from "../redux/actions/pageControllerAction";
import { participatingPlayersAction } from "../redux/actions/tournament/composition/participatingPlayersAction";
import { eventResultConfirmAction } from "../redux/actions/tournament/composition/eventResultAction";

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
    // 他のコンポーネントに引き渡すメソッドについてか以下が必要
    this.checkConfirm = this.checkConfirm.bind(this);
    this.redirectInput = this.redirectInput.bind(this);
  }
  checkConfirm() {
    if(this.props.requiredConfirm) {
      this.props.alert.show(getMessage(msg.MSG_REQUIRED_CONFIRM));
    }
    return !this.props.requiredConfirm;
  }
  redirectInput(bibs) {
    this.props.changeBibs(bibs);
    this.props.history.push('/input')
  }
  componentDidMount() {
    document.title = getMessage(msg.TITLE_PLAYER);
    let h = this.props.header;
    // ブラウザのリロードを押された場合、stateはクリアされる。(redirectの前にcallされる)
    if(h.day) {
      this.props.dispatchParticipatingPlayers(h.gender, h.subdivision.id, h.competitionGroup.id);
    }
  }
  doConfierm(e) {
    let confirm = document.getElementById('confirm');
    if(!confirm.checked) {
      this.props.alert.show(getMessage(msg.MSG_REQUIRED_CONFIRM));
    } else {
      let h = this.props.header;
      let players = this.props.players.map((p, i) => this.props.participatingPlayers[p.bibs].player_id);
      this.props.dispatchEventResultConfirmAction(h, players, 
        () => this.props.dispatchParticipatingPlayers(h.gender, h.subdivision.id, h.competitionGroup.id)
      );
    }
  }
  renderView() {
    const htmlPlayers = this.props.players.map((p, i) => {
      let pp = this.props.participatingPlayers[p.bibs];
      let style = (isValidityPlayer(pp) ? null : "abstention" );
      let scoreStyle = (isTopNumber(p.bibs, this.props.teamScore) ? CSS_TOP_NUMBER : null);
      return (
      <tr key={`${Player.displayName}_${i}`} className={style} >
        <ParticipatingPlayer event={this.props.header.event.id} player={p} participatingPlayer={pp} onClick={this.redirectInput} scoreStyle={scoreStyle} />
      </tr>
      )
    });
    // 承認ボタンの表示
    let htmlConfirmBox;
    if(this.props.requiredConfirm) {
      htmlConfirmBox = (
        <div>
          <label>
            <input type="checkbox" id="confirm" name="confirm" />{getMessage(msg.MSG_CONFIRM)}
          </label>
          <button type="button" className="btn-secondary" onClick={e => this.doConfierm(e)}>{getMessage(msg.TXT_REGISTER)}</button>
        </div>
      );
    }
    let navi = [
      [getMessage(msg.TITLE_COMPETITION), "/", () => this.checkConfirm()],
      [getMessage(msg.TITLE_SUBDIVISION), "/subdivision", () => this.checkConfirm()],
      [getMessage(msg.TITLE_GROUP), "/group", () => this.checkConfirm()],
    ];
    return (
      <div className="player">
        <ContentHeader header={this.props.header} />
        <ContentnNavi navi={navi} history={this.props.history} />
        <div className="content-body">
          <table>
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
              {htmlPlayers}
              <tr>
                <td className="teamTotalNull" colSpan="9"></td>
                <td className="teamTotalLabel" colSpan="3">チーム得点</td>
                <td className="teamTotal">{this.props.teamScore.score}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="content-footer">
          {htmlConfirmBox}
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
  // API call?
  let isFetching = getFetching(state);
  if(isFetching) return { error, isFetching }
  // Page表示判定
  let isPermittedView = ctl.gender && ctl.classification && ctl.event && ctl.subdivision && ctl.competitionGroup;
  // 追加propsの設定
  let header = getHeaderProps(state);
  let players = (header.competitionGroup ? header.competitionGroup.players : {}); 
  // チーム得点の集計
  let teamScore = getEventTeamScore(ctl.event, players, pp.players);
  let requiredConfirm = (teamScore.numberOfPlayer > 0 &&
                        teamScore.numberOfPlayer == teamScore.numberOfActed &&
                        teamScore.numberOfPlayer > teamScore.numberOfConfirmed
  );
  let additionalProps = {
    error,
    isFetching,
    isPermittedView,
    tournament: state.tournament.composition.tournament,
    header,
    players,
    participatingPlayers: pp.players,
    teamScore,
    requiredConfirm,
  };
  return additionalProps;
};
const mapDispatchToProps = dispatch => {
  return {
    // dispatching plain actions
    changeBibs: (value) => dispatch(pageControllerBibsAction(value)),
    dispatchParticipatingPlayers: (gender, subdivision, group, bibs) => dispatch(participatingPlayersAction(gender, subdivision, group, bibs)),
    dispatchEventResultConfirmAction: (header, players, next) => dispatch(eventResultConfirmAction(header, players, next)),
  }
};

Player.displayName = "Player";
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Player))
