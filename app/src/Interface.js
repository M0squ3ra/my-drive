import React from 'react';
import './Interface.css'

function Interface(){
  return(
    <div className="Interface">
      <Header></Header>
      <LeftBox></LeftBox>
      <RightBox></RightBox>
    </div>
  );
}

function Header(){
  return(
    <div className="Header">
      <h2>MyDrive</h2>
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
      {props.search != null &&
        <h2>Result for: {props.search}</h2>
      }
    </div>
  )
}

class SearchBar extends React.Component{
  constructor(props){
    super(props);
    this.state = {name: null, search: null};
  }

  handleClickSearch(){
    this.setState({search: this.state.name});
  }

  render(){
    return(
      <div className="SearchBar">
        <input 
          type="text"
          placeholder="search"
          onChange={event => this.setState({name: event.target.value})}
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
        <h3>{this.props.name}</h3>
      </div>
    );
  }
}

class File{
  constructor(name,type){
    this.name = name;
    this.type = type;
  }
}

// delete
var files = [];
files.push(new File('File1','txt'));
files.push(new File('File2','txt'));
files.push(new File('File3','txt'));

class ItemsBox extends React.Component{
  constructor(props){
    super(props);
  }

  render(){
    return(
      <div className="ItemsBox">     
          {files.map(file => <ItemBox name={file.name}></ItemBox>)}
      </div>
    );
  }
}

function RightBox(){
  return(
    <div className="RightBox">
      <SearchBar></SearchBar>
      <h1>center</h1>
      <ItemsBox></ItemsBox>
    </div>
  )
}

export default Interface;