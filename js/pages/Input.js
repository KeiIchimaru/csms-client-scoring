import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Redirect } from 'react-router-dom';
import { connect } from "react-redux";

import { getMessage, isAllEntered, toFloatAll, round } from "../lib/ulib";
import { getHeaderProps, getStateError, getFetching } from "../lib/propsLib";
import * as msg from "../lib/messages";

// Redux Action
import { participatingPlayersAction } from "../redux/actions/tournament/composition/participatingPlayersAction";
import { eventResultRegisterAction } from "../redux/actions/tournament/composition/eventResultAction";

// React Component
import TenKeyboard from "../components/container/TenKeyboard";

import Error from "../components/presentational/error";
import Loading from "../components/presentational/loading";
import ContentHeader from "../components/presentational/contentHeader";
import ContentnNavi from "../components/presentational/contentnNavi";
import InputNumber0_1 from "../components/presentational/inputNumber0_1";
import PlayerName from "../components/presentational/playerName";

function calculateScore(decimal_places, state) {
  let ndigits = 10 ** decimal_places;
  let d = state.d2 ? round((state.d1 + state.d2) / 2.0, ndigits) : state.d1;
  let ee = [state.e1, state.e2];
  if(state.e3) ee.push(state.e3);
  if(state.e4) ee.push(state.e4);
  let et = 0.0;
  if(ee.length == 4) et = round(ee.reduce((ttl, v) => ttl + v) - Math.max(...ee) - Math.min(...ee), ndigits);
  if(ee.length == 3) et = round(ee.reduce((ttl, v) => ttl + v) - Math.min(...ee), ndigits);
  if(ee.length == 2) et = round(ee.reduce((ttl, v) => ttl + v), ndigits);
  let e = round((et / 2.0), ndigits);
  let score = round(d + e - state.penalty, ndigits);
  let data = { ...state, et, e, score };
  return data;
}
/*
  mapStateToProps(players=3) →　mapDispatchToProps →　constructor →　render →　componentDidMount →　
  dispatchParticipatingPlayers →　
  mapStateToProps(players=0) → componentDidUpdate →　mapStateToProps(players=1) →　render → componentDidUpdate(setState) →
  render → componentDidUpdate
*/
class Input extends Component {
  constructor(props) {
    super(props);
    const n = this.props.tournament.notices;
    let newValue = {};
    newValue.d1 = null;
    if(n.numberOfD >= 2) newValue.d2 = null;
    newValue.e1 = null;
    newValue.e2 = null;
    if(n.numberOfE >= 3) newValue.e3 = null;
    if(n.numberOfE >= 4) newValue.e4 = null;
    newValue.penalty = null;
    this.state = {
      isUpdate: false,
      // 入力必須項目はnullで初期化しておく
      newValue,
      fieldStyle: {}
    };
    this.oldValue = null;
    this.handleOnBlur = this.handleOnBlur.bind(this);
    this.handleOnClick = this.handleOnClick.bind(this);
    this.handleOnClickContent = this.handleOnClickContent.bind(this);
    this.setFieldValue = this.setFieldValue.bind(this);
    this.tenKeyboard = new TenKeyboard(this.setFieldValue);
  }
  setFieldValue(fieldValue) {
    let newValue = { ...this.state.newValue, ...fieldValue };
    this.setState({ newValue });
  }
  componentDidMount() {
    document.title = getMessage(msg.TITLE_INPUT);
    let h = this.props.header;
    // ブラウザのリロードを押された場合、stateはクリアされる。(redirectの前にcallされる)
    if(h.day) {
      this.props.dispatchParticipatingPlayers(h.gender, h.subdivision.id, h.competitionGroup.id, h.player.bibs);
    }
  }
  componentDidUpdate(prevProps) {
    // mapStateToPropsでstateがpropsに変換されている。
    let ppp = prevProps.header ? prevProps.header.participatingPlayer  : null;
    let pp = this.props.header ? this.props.header.participatingPlayer : null;
    if(!ppp && pp) {
      // this.state更新
      if(pp.scores && pp.scores[this.props.header.event.id]) {
        this.oldValue = JSON.parse(pp.scores[this.props.header.event.id].constitution);
        let json = JSON.parse(pp.scores[this.props.header.event.id].constitution);
        let newValue = { ...this.state.newValue, ...json };
        this.setState({ newValue });
      }
    }
    // 更新後に画面遷移する。
    if(!this.props.isFetching && this.state.isUpdate) {
      this.props.history.push("/player");
    }
  }
  handleOnBlur(target) {
    let newValue = toFloatAll(this.state.newValue);
    if(isAllEntered(newValue)) {
      newValue = calculateScore(this.props.header.event.decimal_places, newValue);
    }
    this.setState({ newValue });
    return newValue;
  }
  handleOnClick(e) {
    // <div><input radonly/></div>でクリックは<div>が取得
    this.tenKeyboard.setTarget(e.target, this.handleOnBlur);
    let style = {};
    style[e.target.name] = this.tenKeyboard.fourcusStyle;
    this.setState({ fieldStyle: style })
  }
  handleOnClickContent(e) {
    // 入力フィールド？
    if(e.target.tagName.toLowerCase() == "input") return;
    // tenKeypad?
    if(e.target.tagName.toLowerCase() == "td") {
      if(e.target.closest("#tenKeypad")) return;
    }
    // NAVI?
    if(e.target.tagName.toLowerCase() == "div") {
      if(e.target.closest("#content-navi")) return;
    }
    // 上記以外をクリック
    this.tenKeyboard.setTarget(null, this.handleOnBlur);
    this.setState({ fieldStyle: {} });
  }
  doUpdate() {
    const newValue = this.handleOnBlur();
    let message;
    if(isAllEntered(newValue)) {
      if(!newValue.d2 || (newValue.d2 && newValue.d1 == newValue.d2)) {
        let isChange = false;
        if(this.oldValue == null) {
          isChange = true;
        } else {
          for (let key in newValue) {
            if(newValue[key] != this.oldValue[key]) {
              isChange = true;
              break;
            }
          }
        }
        if(isChange) {
          this.props.dispatchEventResultRegisterAction(this.props.header, newValue);
          this.setState({ isUpdate: true, });
          return true;  
        } else {
          message = msg.MSG_NOT_CHANGED;
        }
      } else {
        message = msg.MSG_D1_D2_DIFFERENT_SCORES;
      }
    } else {
      message = msg.MSG_REQUIRE_ALL_ITEMS
    }
    this.props.alert.show(getMessage(message));
    return false;
  }
  renderView() {
    const i = this.state.newValue;
    const s = this.state.fieldStyle;
    const h = this.props.header;
    const pp = h.participatingPlayer;
    const n = this.props.tournament.notices;
    const navi = [
      [getMessage(msg.TXT_CANCEL), "/player"],
      [getMessage(msg.TXT_RETURN), null, () => this.doUpdate()],
    ];
    return (
      <div className="input" onClick={this.handleOnClickContent} >
        <ContentHeader header={this.props.header} displayShort={true} />
        <ContentnNavi navi={navi} history={this.props.history} />
        <div className="participatingPlayer">
          <div className="mr-5">{this.props.header.eventName}</div>
          <div>{parseInt(pp.bibs)}番:</div><div><PlayerName player={pp}/></div>
        </div>
        <div className="content-body">
          <form>
            <table>
              <thead>
                <tr>
                  { n.numberOfD >= 2 &&
                  <th><div>D2</div></th>
                  }
                  <th><div>D1</div></th>
                  <th className="boderLeft2"><div>E1</div></th>
                  <th><div>E2</div></th>
                  { n.numberOfE >= 3 &&
                  <th><div>E3</div></th>
                  }
                  { n.numberOfE >= 4 &&
                  <th><div>E4</div></th>
                  }
                  <th className="boderLeft2"><div>E計</div></th>
                  <th><div>合計</div></th>
                  <th><div>減点</div></th>
                  <th className="boderLeft2"><div>決定点</div></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  { n.numberOfD >= 2 &&
                  <td><div onClick={this.handleOnClick}><InputNumber0_1 name="d2" value={i.d2} style={s.d2} /></div></td>
                  }
                  <td><div onClick={this.handleOnClick}><InputNumber0_1 name="d1" value={i.d1} style={s.d1} /></div></td>
                  <td className="boderLeft2">
                      <div onClick={this.handleOnClick}><InputNumber0_1 name="e1" value={i.e1} style={s.e1} /></div>
                  </td>
                  <td><div onClick={this.handleOnClick}><InputNumber0_1 name="e2" value={i.e2} style={s.e2} /></div></td>
                  { n.numberOfE >= 3 &&
                  <td><div onClick={this.handleOnClick}><InputNumber0_1 name="e3" value={i.e3} style={s.e3} /></div></td>
                  }
                  { n.numberOfE >= 4 &&
                  <td><div onClick={this.handleOnClick}><InputNumber0_1 name="e4" value={i.e4} style={s.e4} /></div></td>
                  }
                  <td className="boderLeft2" ><div>{i.et}</div></td>
                  <td><div>{i.e}</div></td>
                  <td><div onClick={this.handleOnClick}><InputNumber0_1 name="penalty" value={i.penalty} style={s.penalty} /></div></td>
                  <td className="boderLeft2" ><div>{i.score}</div></td>
                </tr>
              </tbody>
            </table>
          </form>
        </div>
        <div  className="content-footer">
          {this.tenKeyboard.render()}
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
  // API error判定
  let error = getStateError(state);
  if(error) return { error };
  // API call?
  let isFetching = getFetching(state);
  if(isFetching) return { error, isFetching }
  // Page表示判定
  let isPermittedView = ctl.gender && ctl.classification && ctl.event && ctl.subdivision && ctl.competitionGroup && ctl.bibs;
  // 追加propsの設定
  let header = getHeaderProps(state);
  let additionalProps = {
    error,
    isFetching,
    isPermittedView,
    tournament: state.tournament.composition.tournament,
    header,
  };
  return additionalProps;
};
const mapDispatchToProps = dispatch => {
  return {
    // dispatching plain actions
    dispatchParticipatingPlayers: (gender, subdivision, group, bibs) => dispatch(participatingPlayersAction(gender, subdivision, group, bibs)),
    dispatchEventResultRegisterAction: (header, data) => dispatch(eventResultRegisterAction(header, data)),
  }
};

Input.displayName = "Input";
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Input))
