import React from 'react';
import './Register.css'
import Axios from 'axios';
import { Redirect } from 'react-router-dom';

class Register extends React.Component{
    constructor(props){
        super(props);
        this.handlRegister = this.handlRegister.bind(this);
        this.state = {
            usernameLog: "",
            passwordLog: "",
            confirmPasswordLog: "",
            error: false,
            userError: false,
            passwordError: false,
            confirmPasswordError: false,
            redirect: false
        }
    }

    handlRegister = () => {
        let err = false;

        if(this.state.usernameLog.length < 4 || this.state.usernameLog.length > 15){
            err = true;
            this.setState({userError: true});
        } else{
            this.setState({userError: false});
        }
        if(this.state.passwordLog.length < 8 || this.state.passwordLog.length > 15){
            err = true;
            this.setState({passwordError: true});
        } else {
            this.setState({passwordError: false});
        }
        if(this.state.passwordLog !== this.state.confirmPasswordLog){
            err = true;
            this.setState({confirmPasswordError: true})
        } else{
            this.setState({confirmPasswordError: false})
        }

        if(!err){
            Axios.post("http://localhost:8080/auth/signup",
        {
            username: this.state.usernameLog,
            password: this.state.passwordLog
        }).then((response) => {
            if(response.status === 201){
                console.log('exito')
                localStorage.clear();
                this.setState({redirect: true})
            }
        }).catch(err => {
            this.setState({error: true});
        }); 
        }
    }
    handleEnterRegister(key){
        if(key.code === 'Enter'){
            this.handlRegister();
        }
    }

    render(){
        const redirect = this.state.redirect;

        if (redirect) {
            return <Redirect to='/auth/login'/>;
        }

        return (
            <div className="Register">
                <div className="CentralBox">
                    <h1>Register</h1>
                    <label>Username</label><br/>
                    <input type="text" onKeyPress={this.handleEnterRegister.bind(this)} placeholder="User" onChange={event => this.setState({usernameLog: event.target.value})}/><br/>
                    {this.state.userError && <p className="Error1">El nombre de usuario debe contener entre 4 y 15 caracteres</p>}
                    <label>Password</label><br/>
                    <input type="password" onKeyPress={this.handleEnterRegister.bind(this)} placeholder="Pass" onChange={event => this.setState({passwordLog: event.target.value})}/><br/>
                    {this.state.passwordError && <p className="Error2">La contraseña debe contener entre 4 y 15 caracteres</p>}
                    <label>Confirm Password</label><br/>
                    <input type="password" onKeyPress={this.handleEnterRegister.bind(this)} placeholder="Pass" onChange={event => this.setState({confirmPasswordLog: event.target.value})}/><br/>
                    {this.state.confirmPasswordError && <p className="Error3">Las contraseñas no coinciden</p>}
                    {this.state.error && <p>Datos invalidos, pruebe con otro usuario</p>}
                    <button type="submit" onClick={this.handlRegister}>Register</button>
                </div>
            </div>
        )
    }
}

export default Register