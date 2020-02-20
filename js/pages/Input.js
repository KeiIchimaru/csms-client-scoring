import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Redirect } from 'react-router-dom';
import { connect } from "react-redux";

import { getMessage, isAllEntered } from "../lib/ulib";
import {
  TITLE_INPUT,
  TXT_CANCEL,
  TXT_RETURN,
  MSG_REQUIRE_ALL_ITEMS,
  MSG_D1_D2_DIFFERENT_SCORES,
} from "../lib/messages";
import { getHeaderProps } from "../lib/props/headerProps";

// Redux Action
import { participatingPlayersAction } from "../redux/actions/tournament/composition/participatingPlayersAction";
import { eventResultRegisterAction } from "../redux/actions/tournament/composition/eventResultAction";

// React Component
import Error from "../components/presentational/error";
import Loading from "../components/presentational/loading";
import ContentHeader from "../components/presentational/contentHeader";
import ContentnNavi from "../components/presentational/contentnNavi";
import InputNumber0_1 from "../components/presentational/inputNumber0_1";
import PlayerName from "../components/presentational/playerName";

function calculateScore(state) {
  let ndigits = 100;
  let d = (state.d1 + state.d2) / 2.0;
  d = Math.round(d * ndigits) / ndigits;
  let ee = [state.e1, state.e2, state.e3, state.e4];
  let et = ee.reduce((ttl, v) => ttl + v) - Math.max(...ee) - Math.min(...ee);
  let e = (et / 2.0);
  e = Math.round(e * ndigits) / ndigits;
  let score = d + e - state.penalty;
  let data = { ...state, et, e, score };
  return data;
}

class Input extends Component {
  constructor(props) {
    super(props);
    console.log("constructor");
    let pp = props.header.participatingPlayer;
    // this.state更新
    if(pp && pp.scores && pp.scores[props.header.event]) {
      this.state = JSON.parse(pp.scores[props.header.event].constitution);
    } else {
      this.state = {
        d1: null,
        d2: null,
        e1: null,
        e2: null,
        e3: null,
        e4: null,
        penalty: null
      }  
    }
    this.handleChangeForm = this.handleChangeForm.bind(this);
  }
  componentDidMount() {
    console.log("componentDidMount");
    document.title = getMessage(TITLE_INPUT);
    let h = this.props.header;
    // ブラウザのリロードを押された場合、stateはクリアされる。(redirectの前にcallされる)
    if(h.day) {
      this.props.dispatchParticipatingPlayers(h.gender, h.subdivision.id, h.competitionGroup.id, h.player.bibs);
      console.log("dispatchParticipatingPlayers");
    }
  }
  handleChangeForm(e) {
    let inputData = { [e.target.name]: parseFloat(e.target.value), };
    this.setState(inputData);
    let newState = { ...this.state, ...inputData };
    if(isAllEntered(newState)) {
      this.setState(calculateScore(newState));
    }
  }
  doUpdate() {
    let msg = MSG_REQUIRE_ALL_ITEMS;
    if(isAllEntered(this.state)) {
      if(this.state.d1 == this.state.d2) {
        this.props.dispatchEventResultRegisterAction(this.props.header, this.state);
        return true;  
      }
      msg = MSG_D1_D2_DIFFERENT_SCORES;
    }
    this.props.alert.show(getMessage(msg));
    return false;
  }
  renderView() {
    let s = this.state;
    console.log( "renderView", s);
    let h = this.props.header;
    let pp = h.participatingPlayer;
    let navi = [
      [getMessage(TXT_CANCEL), "/player"],
      [getMessage(TXT_RETURN), "/player", () => this.doUpdate()],
    ];
    return (
      <div className="input">
        <ContentHeader header={this.props.header} />
        <ContentnNavi navi={navi} history={this.props.history} />
        <div className="participatingPlayer">
          <div>{parseInt(pp.bibs)}番:</div><div><PlayerName player={pp}/></div>
        </div>
        <div className="content-body">
          <form onChange={this.handleChangeForm}>
            <table>
              <thead>
                <tr>
                  <th><div>D2</div></th>
                  <th><div>D1</div></th>
                  <th className="boderLeft2"><div>E1</div></th>
                  <th><div>E2</div></th>
                  <th><div>E3</div></th>
                  <th><div>E4</div></th>
                  <th className="boderLeft2"><div>E計</div></th>
                  <th><div>合計</div></th>
                  <th><div>減点</div></th>
                  <th className="boderLeft2"><div>決定点</div></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><div><InputNumber0_1 name="d2" value={s.d2} /></div></td>
                  <td><div><InputNumber0_1 name="d1" value={s.d1} /></div></td>
                  <td className="boderLeft2"><div><InputNumber0_1 name="e1" value={s.e1} /></div></td>
                  <td><div><InputNumber0_1 name="e2" value={s.e2} /></div></td>
                  <td><div><InputNumber0_1 name="e3" value={s.e3} /></div></td>
                  <td><div><InputNumber0_1 name="e4" value={s.e4} /></div></td>
                  <td className="boderLeft2" ><div>{s.et}</div></td>
                  <td><div>{s.e}</div></td>
                  <td><div><InputNumber0_1 name="penalty" value={s.penalty} /></div></td>
                  <td className="boderLeft2" ><div>{s.score}</div></td>
                </tr>
              </tbody>
            </table>
          </form>
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
  console.log("mapStateToProps");
  // state略号設定
  let ctl = state.pageController;
  let t = state.tournament.composition.tournamentEvent;
  let s = state.tournament.management.subdivisions;
  let pp = state.tournament.composition.participatingPlayers;
  // API error判定
  let error = t.error || s.error || pp.error;
  if(error) return { error };
  // Page表示判定
  let isFetching = t.isFetching || s.isFetching || pp.isFetching;
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
  console.log("mapDispatchToProps");
  return {
    // dispatching plain actions
    dispatchParticipatingPlayers: (gender, subdivision, group, bibs) => dispatch(participatingPlayersAction(gender, subdivision, group, bibs)),
    dispatchEventResultRegisterAction: (header, data) => dispatch(eventResultRegisterAction(header, data)),
  }
};

Input.displayName = "Input";
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Input))
