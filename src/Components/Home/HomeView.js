/////////////////////////////////////////////////////////////////////////////////////////////////////
// IMPORTS //////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react'
import PropTypes from "prop-types";
import neo4j from "neo4j-driver/lib/browser/neo4j-web";
import {Helmet} from "react-helmet";
import HomeStatic from "./HomeStatic.js"
import Navbar from "../Navbar/Navbar.js";
import * as helper from "../Utils/Helpers.js";
import * as query from "../Utils/Queries.js";
import translate from "../../Assets/indexes/translate.json"
import { useLocation } from 'react-router-dom';

export function withRouter(Children){
  return(props)=>{
     const match  = {params: useLocation()};
     console.log(match)
     return <Children {...props}  match = {match}/>
 }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////
// COMPONENT ////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

class HomeView extends React.Component {

//STATE CONSTRUCTOR ////////////////////////////////////////////////////////////////////////////////
  constructor(props) {
  super(props);
  this.state = {
    language: "en",
    cite: "cite hide",
  }
// BIND UTILITY FUNCTIONS TO THIS CONTEXT ///////////////////////////////////////////////////////////
  this.toggleDisplay = helper.toggleDisplay.bind(this);
  this.toggleCite = helper.toggleCite.bind(this);
  this.langSwitch = helper.langSwitch.bind(this);
  };

//RUN ON COMPONENT MOUNT ////////////////////////////////////////////////////////////////////////////
  componentDidMount() {
    if (this.props.match.params.state == null ) {} else {
      if (this.props.match.params.state.langgive) {
      this.setState({ language: this.props.match.params.state.langgive }); 
      }
    };
  };


//RENDER ////////////////////////////////////////////////////////////////////////////////////////////
  render() {

    const backgroundStyle = {
      backgroundImage: `url("https://chcdatabase.com/wp-content/uploads/2020/07/Last_Supper-e1596117198957.jpg")`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'top center',
      backgroundSize: 'cover',
      overflow: 'auto'
    };

    return (
    <div>
      <Helmet>
        <html lang={this.state.language} />
        <title>{translate[0]["chcd_name"][this.state.language]} - {translate[0]["home"][this.state.language]}</title>
      </Helmet>
      <div style={backgroundStyle}>
      <div className="gradient-back text-light bg-opacity-50" >
        <Navbar
          home="home"
          language={this.state.language}
          langSwitch={this.langSwitch}
          toggleCite = {this.toggleCite}
        />
        <HomeStatic language={this.state.language} />

      </div>
      </div>
    </div>
    )
  }

}

/////////////////////////////////////////////////////////////////////////////////////////////////////
// EXPORT //////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

export default withRouter(HomeView)
