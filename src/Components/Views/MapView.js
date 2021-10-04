// IMPORTS ////////////////////////////////////////////////////////////////////

// MAIN DEPENDENCIES
import React, { Component } from 'react'
import neo4j from "neo4j-driver/lib/browser/neo4j-web";
// CHILD COMPONENTS
import FilterMap from "../Filters/FilterMap.js";
import LeafletMap from "../DataDisplays/LeafletMap.js";
import Popup from "../DataDisplays/Popup.js";
import NoResults from "../DataDisplays/NoResults.js";
import NoSend from "../DataDisplays/NoSend.js";
// HELPER FILES
import credentials from "../../credentials.json";
import * as helper from "../Utils/Helpers.js";
import * as query from "../Utils/Queries.js";


class MapView extends Component {

//STATE, PROPS, DRIVER INFO, & BINDS //////////////////////////////////////////
  constructor(props) {
    super(props);
    this.state = {
      //FILTER INPUTS
      kind: "People",
      given_name_western: "",
      family_name_western: "",
      name_western: "",
      religious_family: "All",
      institution_category: "All",
      institution_subcategory: "All",
      gender: "All",
      nationality: "All",
      location: "All",
      affiliation: "All",
      start_year: "",
      end_year: "",
      // DATA ARRAYS & SELECT NODE
      nodeArray: [],
      selectArray: [],
      breadCrumb: [],
      nodeSelect: "",
      // DISPLAY CONTROLS
      popupcontainer: "popupcontainer hide",
      filterDisplay: "filter_container",
      addinfo: "addinfo hide",
      noresults: "noresults hide",
      nosend: "nosend hide",
      // FORM SELECTS
      instCatsIndex: [],
      relFamIndex: [],
      affIndex: [],
      pAffIndex: [],
      natIndex: [],
      placeIndex: [],
      // LOAD STATES
      content: "loaded",
      //MAP BOUNDS
      mapBounds: [[54.31,137.28],[18.312,71.63],],
    };
    //INITIATE NEO4J INSTANCE
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
    this.fetchMapIndexes();
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
        <FilterMap
          {...this.state}
          handleChange={this.handleChange}
          resetFilter={this.resetFilter}
          fetchResults={this.fetchResults}
          filterHide={this.filterHide}
          handleFormChange={this.handleFormChange}
        />
        <LeafletMap
          content={this.state.content}
          nodeArray={this.state.nodeArray}
          bounds={this.state.mapBounds}
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

export default MapView
