import React, {useState} from 'react';
import './Login.css'
import Axios from 'axios';
import { Redirect } from 'react-router-dom';

class Login extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            usernameLog: "",
            passwordLog: "",
            loginStatus: false
        }
        this.handleLogin = this.handleLogin.bind(this);
    }
    

    handleLogin = () => {
        Axios.post("http://localhost:8080/auth/generate-token",
        {
            username: this.state.usernameLog,
            password: this.state.passwordLog
        }).then((response) => {
            localStorage.setItem("token",response.data.token); //puede ser que tenga que remover el Bearer
            localStorage.setItem("username",this.state.usernameLog);
            this.setState({loginStatus: true});
        }).catch(err => {
            localStorage.removeItem("token");
            localStorage.removeItem("username");
            this.setState({loginStatus: false});
        }); 
    } 

    handleEnterLogin(key){
        if(key.code === 'Enter'){
            this.handleLogin();
        }
    }

    render(){
        return(
            <div className="Login">
                <div className="CentralBox">
                    <h1>Login</h1>
                    <label>Username</label><br/>
                    <input type="text" onKeyPress={this.handleEnterLogin.bind(this)} placeholder="User" onChange={event => this.setState({usernameLog: event.target.value})}/><br/>
                    <label>Password </label><br/>
                    <input type="password" onKeyPress={this.handleEnterLogin.bind(this)} placeholder="Pass" onChange={event => this.setState({passwordLog: event.target.value})}/><br/>
                    <button type="submit" onClick={this.handleLogin}>Login</button>
                    {this.state.loginStatus === true?<Redirect to='/dashboard'/>:<Redirect to='/auth/login'/>}
                </div>
            </div>
        );
    }
}

export default Login;
