import './App.css';
import Dashboard from './Dashboard.js';
import Login from './Login';
import { Switch, Route, BrowserRouter, Redirect} from 'react-router-dom';
import React from 'react';

class App extends React.Component {
  render(){
    return (
      <div className="App">
        <BrowserRouter>
          <Switch>
            <Route path='/auth/login' component={Login}/>
            <Route path='/dashboard' component={Dashboard}/>
            {!localStorage.getItem("token") && <Redirect to='auth/login'/>}
          </Switch>
        </BrowserRouter>
      </div>
    );
  }

}

export default App;
