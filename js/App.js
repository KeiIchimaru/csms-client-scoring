import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from "react-router-dom";
import { connect } from "react-redux";
import { useAlert } from 'react-alert'

import Competition from './pages/Competition';
import Subdivision from './pages/Subdivision';
import Group from './pages/Group';
import Player from './pages/Player';
import Input from './pages/Input';

import Loading from "./components/presentational/loading";

// コンポーネントにデータをpropsとして引き継ぐ場合
// <Route path='/subdivision' render={props => <Subdivision basename={basename} {...props} />} />
// ...propsはスプレッド構文です。

const basename = '/scoring';

const App = (props) => {
  const alert = useAlert();
  const dispatch = props.dispatch;
  return (
    <Router basename={basename}>
      <Switch>
        <Route exact　path='/'     render={props => <Competition alert={alert} dispatch={dispatch} {...props} />} />
        <Route path='/subdivision' render={props => <Subdivision alert={alert} dispatch={dispatch} {...props} />} />
        <Route path='/group'       render={props => <Group alert={alert} dispatch={dispatch} {...props} />} />
        <Route path='/player'      render={props => <Player alert={alert} dispatch={dispatch} {...props} />} />
        <Route path='/input'       render={props => <Input alert={alert} dispatch={dispatch} {...props} />} />
        <Route render={() => <h2>Not Found</h2>} />
      </Switch>
    </Router>
  )
}

export default connect()(App)