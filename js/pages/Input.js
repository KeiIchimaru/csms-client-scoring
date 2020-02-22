import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Redirect } from 'react-router-dom';
import { connect } from "react-redux";

import { getMessage, isAllEntered, round } from "../lib/ulib";
import { getHeaderProps, getStateError, getFetching } from "../lib/propsLib";
import * as msg from "../lib/messages";

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
  let d = round((state.d1 + state.d2) / 2.0, ndigits);
  let ee = [state.e1, state.e2, state.e3, state.e4];
  let et = round(ee.reduce((ttl, v) => ttl + v) - Math.max(...ee) - Math.min(...ee), ndigits);
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
    this.state = {
      isChange: false,
      isUpdate: false,
      input: {
        d1: null,
        d2: null,
        e1: null,
        e2: null,
        e3: null,
        e4: null,
        penalty: null  
      }
    };
    this.handleChangeForm = this.handleChangeForm.bind(this);
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
    let ppp = prevProps.header.participatingPlayer;
    let pp = this.props.header.participatingPlayer;
    if(typeof ppp === 'undefined' && pp) {
      // this.state更新
      if(pp.scores && pp.scores[this.props.header.event]) {
        this.setState({
          isChange: false,
          input: JSON.parse(pp.scores[this.props.header.event].constitution)
        });
      }
    }
    // 更新後に画面遷移する。
    if(!this.props.isFetching && this.state.isUpdate) {
      this.props.history.push("/player");
    }
  }
  handleChangeForm(e) {
    let inputData = { ...this.state.input, [e.target.name]: parseFloat(e.target.value) };
    this.setState({ isChange: true, input: inputData });
    if(isAllEntered(inputData)) {
      this.setState({ input: calculateScore(inputData) });
    }
  }
  doUpdate() {
    let message;
    if(isAllEntered(this.state.input)) {
      if(this.state.input.d1 == this.state.input.d2) {
        if(this.state.isChange) {
          this.props.dispatchEventResultRegisterAction(this.props.header, this.state.input);
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
    let s = this.state.input;
    let h = this.props.header;
    let pp = h.participatingPlayer;
    let navi = [
      [getMessage(msg.TXT_CANCEL), "/player"],
      [getMessage(msg.TXT_RETURN), null, () => this.doUpdate()],
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
  // state略号設定
  let ctl = state.pageController;
  // API error判定
  let error = getStateError(state);
  if(error) return { error };
  // Page表示判定
  let isFetching = getFetching(state);
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
    dispatchParticipatingPlayers: (gender, subdivision, group, bibs) => dispatch(participatingPlayersAction(gender, subdivision, group, bibs)),
    dispatchEventResultRegisterAction: (header, data) => dispatch(eventResultRegisterAction(header, data)),
  }
};

Input.displayName = "Input";
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Input))
