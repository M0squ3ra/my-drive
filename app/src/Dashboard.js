import React from 'react';
import './Dashboard.css';
import { Redirect, useHistory } from 'react-router-dom';
import Axios from 'axios';

class Dashboard extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      files: []
    }
    this.getFiles = this.getFiles.bind(this);
  }

  getFiles(search){
    const headers = {Authorization: 'Bearer ' + localStorage.getItem("token")}
    const data = {search: search};

    Axios.post('http://localhost:8080/files',
      data,
      {headers: headers}
    ).then((response) => {
        this.setState({files: response.data});
    });
  }

  render(){
    if (!localStorage.getItem("token")) {
      return (<Redirect to='auth/login'/>);
    }
    return(
      <div className="Dashboard">
        <Header></Header>
        <LeftBox></LeftBox>
        <RightBox dashboardState={this.state} getFiles={this.getFiles}></RightBox>
      </div>
    );
  }
}


function Header(){
  return(
    <div className="Header">
      <h2>MyDrive</h2>
      <div className='UserInfo'>
        <h3>User: {localStorage.getItem("username")}</h3>
        <button>Logout</button>
      </div>
    </div>
  );
}

function LeftBox(){
  return(
    <div className="LeftBox">
      <ul>
          <li>
              <a href="#">Todos los archivos</a>
          </li>
          <li>
              <a href="#">Privados</a>
          </li>
          <li>
              <a href="#">Publicos</a>
          </li>
          <li>
              <a href="#">Papelera</a>
          </li>
      </ul>
    </div>
  );
}

function SearchResult(props){
  return(
    <div className="SearchResult">
      {props.search !== "" &&
        <h2>Result for: {props.search}</h2>
      }
    </div>
  )
}

class SearchBar extends React.Component{
  constructor(props){
    super(props);
    this.state = {name: "", search: ""};
  }

  handleClickSearch(){
    this.search();
  }
  handleEnterSearch(key){
    if(key.code === 'Enter'){
      this.search();
    }
  }

  search(){
    this.setState({search: this.state.name},
      () => this.props.getFiles(this.state.search));
  }

  render(){
    return(
      <div className="SearchBar">
        <input 
          type="text"
          placeholder="Search"
          onChange={event => this.setState({name: event.target.value})}
          onKeyPress={this.handleEnterSearch.bind(this)}
        />
        <button type="submit" onClick={this.handleClickSearch.bind(this)}>Search</button>
        <SearchResult search={this.state.search}></SearchResult>
      </div>
    );
  }
}

class ItemBox extends React.Component{
  constructor(props){
    super(props);
  }
  render(){
    return(
      <div className="ItemBox">
        <p>{this.props.file.fileName.substring(0,40) + '...'}</p>
        <button>Descargar</button>
      </div>
    );
  }
}

class ItemsBox extends React.Component{
  //hasta aca
  constructor(props){
    super(props);
  }

  componentDidMount(){
    this.props.getFiles('');
  }

  render(){
    return(
      <div className="ItemsBox">    
          {this.props.dashboardState.files.map(file => <ItemBox key={file.documentId.toString()} file={file}></ItemBox>)}
      </div>
    );
  }
}

class RightBox extends React.Component{
  constructor(props){
    super(props);
  }
  
  render(){
    return(
      <div className="RightBox">
        <SearchBar getFiles={this.props.getFiles}></SearchBar>
        <ItemsBox dashboardState={this.props.dashboardState} getFiles={this.props.getFiles}></ItemsBox>
      </div>
    );
  };
  
}

export default Dashboard;