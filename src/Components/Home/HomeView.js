// IMPORTS ////////////////////////////////////////////////////////////////////

// MAIN DEPENDENCIES
import React, { Component } from 'react'
import neo4j from "neo4j-driver/lib/browser/neo4j-web";
// CHILD COMPONENTS
import HomeStatic from "./HomeStatic.js"
import Navbar from "../Navbar/Navbar.js";
// HELPER FILES
import * as helper from "../Utils/Helpers.js";
import * as query from "../Utils/Queries.js";


class HomeView extends Component {

  //STATE, PROPS, DRIVER INFO, & BINDS
    constructor(props) {
      super(props);
      this.state = {
        language: "en",
      }
    // BIND UTILITY FUNCTIONS TO THIS CONTEXT
    this.toggleDisplay = helper.toggleDisplay.bind(this);
    this.langSwitch = helper.langSwitch.bind(this);
  };

//RUN ON COMPONENT MOUNT //////////////////////////////////////////////////////
  componentDidMount() {
    let receivedLang = this.props.location.langGive
    if (receivedLang) {this.setState({ language: receivedLang })}
  }

//RENDER //////////////////////////////////////////////////////////////////////
  render() {
    return (
      <div>
      <Navbar language={this.state.language} langSwitch={this.langSwitch}/>
      <HomeStatic language={this.state.language} />
      </div>
    )
  }

}

export default HomeView
