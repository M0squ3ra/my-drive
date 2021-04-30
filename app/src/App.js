import './App.css';
import Dashboard from './Dashboard.js';
import Login from './Login';
import Register from './Register'
import { Switch, Route, BrowserRouter, Redirect, withRouter} from 'react-router-dom';
import React from 'react';

class App extends React.Component {
  render(){
    return (
      <div className="App">
        <BrowserRouter>
          <Switch>
            <Route path='/auth/login' component={Login}/>
            <Route path='/dashboard' component={Dashboard}/>
            <Route path='/register' component={Register}/>
            {(!localStorage.getItem("token") && this.props.location.pathname !== '/register') && <Redirect to='auth/login'/>}
          </Switch>
        </BrowserRouter>
      </div>
    );
  }

}

export default withRouter(App);
