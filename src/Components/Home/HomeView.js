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

    const styles = {
      background: 'url(https://chcdatabase.com/wp-content/uploads/2020/07/Last_Supper-e1596117198957.jpg)'
    }

    return (
      <div style={{
        backgroundImage: `url("https://chcdatabase.com/wp-content/uploads/2020/07/Last_Supper-e1596117198957.jpg")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        overflow: 'auto'
      }}>
      <div className="gradient-back text-light bg-opacity-50" >
        <Navbar home="home" language={this.state.language} langSwitch={this.langSwitch}/>
        <HomeStatic language={this.state.language} />
      </div>
    </div>
    )
  }

}

export default HomeView
