// IMPORTS ////////////////////////////////////////////////////////////////////

// MAIN DEPENDENCIES
import React, { Component } from 'react'
import neo4j from "neo4j-driver/lib/browser/neo4j-web";
// CHILD COMPONENTS
import FilterData from "../Filters/FilterData.js";
import DataCharts from "../DataDisplays/DataCharts.js"
import Popup from "../DataDisplays/Popup.js";
import NoResults from "../DataDisplays/NoResults.js";
// HELPER FILES
import credentials from "../../credentials.json";
import * as helper from "../Utils/Helpers.js";
import * as query from "../Utils/Queries.js";


class DataView extends Component {

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
        start_time: "",
        end_time: "",
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
        // FORM SELECTS
        netPersonIndex: [],
        // LOAD STATES
        content: "loaded"
      }
    // INITIATE NEO4J INSTANCE
    this.driver = neo4j.driver(
      credentials.port,
      neo4j.auth.basic(credentials.username, credentials.password),
      { disableLosslessIntegers: true }
    );
    // BIND UTILITY FUNCTIONS TO THIS CONTEXT
    this.fetchResults = query.fetchResults.bind(this);
    this.selectSwitchInitial = query.selectSwitchInitial.bind(this);
    this.selectSwitchAppend = query.selectSwitchAppend.bind(this);
    this.selectSwitchReduce = query.selectSwitchReduce.bind(this);
    this.breadCrumbChainer = helper.breadCrumbChainer.bind(this);
    this.breadCrumbReducer = helper.breadCrumbReducer.bind(this);
    this.handleChange = helper.handleChange.bind(this);
    this.filterHide = helper.filterHide.bind(this);
    this.resetFilter = helper.resetFilter.bind(this);
    this.handleFormChange = helper.handleFormChange.bind(this);
    this.fetchMapIndexes = query.fetchMapIndexes.bind(this);
    this.toggleDisplay = helper.toggleDisplay.bind(this);
  };

//RUN ON COMPONENT MOUNT //////////////////////////////////////////////////////
  componentDidMount() {
    this.fetchMapIndexes()
  }

//RENDER //////////////////////////////////////////////////////////////////////
  render() {
    return (
      <div>
      <FilterData
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
      <DataCharts />
      </div>
    )
  }

}

export default DataView
