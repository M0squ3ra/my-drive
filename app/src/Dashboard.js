import React, { useRef } from 'react';
import './Dashboard.css';
import { Redirect, useHistory } from 'react-router-dom';
import Axios from 'axios';
import fileDownload from 'js-file-download';

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
      return (<Redirect to='/auth/login'/>);
    }
    return(
      <div className="Dashboard">
        <Header></Header>
        <LeftBox getFiles={this.getFiles}></LeftBox>
        <RightBox dashboardState={this.state} getFiles={this.getFiles}></RightBox>
      </div>
    );
  }
}


class Header extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      redirect: false
    }
    this.handleLogout = this.handleLogout.bind(this)
  }

  handleLogout(){
    localStorage.clear();
    this.setState({redirect: true})
  }

  render(){

    const redirect = this.state.redirect;

     if (redirect) {
       return <Redirect to='/auth/login'/>;
     }

    return(
    <div className="Header">
      <h2>MyDrive</h2>
      <div className='UserInfo'>
        <h3>User: {localStorage.getItem("username")}</h3>
        <button onClick={this.handleLogout}>Logout</button>
      </div>
    </div>
  );}
}

class LeftBox extends React.Component{
  constructor(props){
    super(props);
    this.inputFile = React.createRef();
    this.handleUpload = this.handleUpload.bind(this);
  }

  handleUpload = (e) => {

    const headers = {Authorization: 'Bearer ' + localStorage.getItem("token")}
    const data = new FormData();
    
    Array.prototype.forEach.call(e.target.files,(file) => data.append("files",file));

    Axios.post('http://localhost:8080/upload',
      data,
      {headers: headers}
    ).then((response) => {
      this.props.getFiles('');
    });    

  }

  render(){
    return(
      <div className="LeftBox">
        <button onClick={() => this.inputFile.current.click()}>Subir Archivos</button>
        <input type="file" multiple="multiple" ref={this.inputFile} onChange={this.handleUpload}/>
      </div>
    );
  }
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
    this.handlerDownload = this.handlerDownload.bind(this);
    switch(true){
      case /image/.test(this.props.file.documentType):
        this.icon = "./icons/Images-256.png";
        break;
      case /audio/.test(this.props.file.documentType):
        this.icon = "./icons/Beamed-Notes-256.png"
        break;
      case /video/.test(this.props.file.documentType):
        this.icon = "./icons/Video-256.png";
        break;
      case /document/.test(this.props.file.documentType):
        this.icon = "./icons/Document-256.png";
        break;
      case /text/.test(this.props.file.documentType):
        this.icon = "./icons/Text-Document-256.png";
        break;
      case /zip/.test(this.props.file.documentType):
        this.icon = "./icons/File-Format-ZIP-256.png";
        break;
      default:
        this.icon = "./icons/Document-02-256.png"
    }
  }

  handlerDownload(){

    const headers = {Authorization: 'Bearer ' + localStorage.getItem("token")};
    const data = {}

    Axios.post('http://localhost:8080/download/' + this.props.file.documentId, 
      data,
      {responseType: 'arraybuffer',
      headers: headers}
    ).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data],{type: response.headers['content-type']}));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', this.props.file.fileName);
      link.click();
      link.remove();
   });
  }

  render(){
    return(
      <div className="ItemBox">
        <img src={this.icon}/>
        <p>{this.props.file.fileName.substring(0,40) + '...'}</p>
        <button onClick={this.handlerDownload}>Descargar</button>
      </div>
    );
  }
}

class ItemsBox extends React.Component{
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
