// IMPORTS ////////////////////////////////////////////////////////////////////

// MAIN DEPENDENCIES
import React, { Component } from 'react'
import neo4j from "neo4j-driver/lib/browser/neo4j-web";
// CHILD COMPONENTS
import FilterNetwork from "../Filters/FilterNetwork.js";
import EgoGraph from "../DataDisplays/EgoGraph.js";
import Popup from "../DataDisplays/Popup.js";
import NoResults from "../DataDisplays/NoResults.js";
import NoSend from "../DataDisplays/NoSend.js";
// HELPER FILES
import credentials from "../../credentials.json";
import * as helper from "../Utils/Helpers.js";
import * as query from "../Utils/Queries.js";


class NetworkView extends Component {

//STATE, PROPS, DRIVER INFO, & BINDS
  constructor(props) {
    super(props);
    this.state = {
      //FILTER INPUTS
      people_include: false,
      corp_include: false,
      inst_include: false,
      event_include: false,
      node_id: "",
      given: "",
      degree: 1,
      start_year: "",
      end_year: "",
      // DATA ARRAYS & SELECT NODE
      nodeArray: [],
      selectArray: [],
      nodeSelect: "",
      breadCrumb: [],
      // DISPLAY CONTROLS
      popupcontainer: "popupcontainer hide",
      filterDisplay: "filter_container",
      addinfo: "addinfo hide",
      noresults: "noresults hide",
      nosend: "nosend hide",
      // FORM SELECTS
      netPersonIndex: [],
      // LOAD STATES
      content: "loaded"
    }
    //INITIATE NEO4J INSTANCE
    this.driver = neo4j.driver(
      credentials.port,
      neo4j.auth.basic(credentials.username, credentials.password),
      { disableLosslessIntegers: true }
    );
    // BIND UTILITY FUNCTIONS TO THIS CONTEXT
    this.fetchNetworkResults = query.fetchNetworkResults.bind(this);
    this.handleChange = helper.handleChange.bind(this);
    this.handleCheck = helper.handleCheck.bind(this);
    this.selectSwitchInitial = query.selectSwitchInitial.bind(this);
    this.selectSwitchAppend = query.selectSwitchAppend.bind(this);
    this.selectSwitchReduce = query.selectSwitchReduce.bind(this);
    this.filterHide = helper.filterHide.bind(this);
    this.resetFilter = helper.resetFilter.bind(this);
    this.breadCrumbChainer = helper.breadCrumbChainer.bind(this);
    this.breadCrumbReducer = helper.breadCrumbReducer.bind(this);
    this.fetchNetworkIndexes = query.fetchNetworkIndexes.bind(this);
    this.handleChangeData = helper.handleChangeData.bind(this);
    this.toggleDisplay = helper.toggleDisplay.bind(this);
  };

//RUN ON COMPONENT MOUNT //////////////////////////////////////////////////////
  componentDidMount() {
    this.fetchNetworkIndexes();
  };

//RENDER //////////////////////////////////////////////////////////////////////
  render() {
    return (
      <div>
        <NoSend
          nosend={this.state.nosend}
          toggleDisplay = {this.toggleDisplay}
        />
        <NoResults
          noresults={this.state.noresults}
          toggleDisplay = {this.toggleDisplay}
        />
        <FilterNetwork
          {...this.state}
          selectSwitchInitial={this.selectSwitchInitial}
          handleChange={this.handleChange}
          handleCheck={this.handleCheck}
          resetFilter={this.resetFilter}
          fetchNetworkResults={this.fetchNetworkResults}
          filterHide={this.filterHide}
          fetchNetworkIndexes={this.fetchNetworkIndexes}
          handleChangeData={this.handleChangeData}
        />
        <EgoGraph
          content= {this.state.content}
          nodeArray={this.state.nodeArray}
          node_id={this.state.node_id}
          breadCrumbChainer={this.breadCrumbChainer}
          selectSwitchInitial={this.selectSwitchInitial}
        />
        <Popup
          {...this.state}
          toggleDisplay = {this.toggleDisplay}
          breadCrumbChainer={this.breadCrumbChainer}
          breadCrumbReducer={this.breadCrumbReducer}
          selectSwitchAppend={this.selectSwitchAppend}
          selectSwitchReduce={this.selectSwitchReduce}
          selectSwitchInitial={this.selectSwitchInitial}
        />
      </div>
    )
  }

}

export default NetworkView
