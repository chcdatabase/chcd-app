/////////////////////////////////////////////////////////////////////////////////////////////////////
// IMPORTS //////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react'
import neo4j from "neo4j-driver/lib/browser/neo4j-web";
import {Helmet} from "react-helmet";
import FilterMap from "./FilterMap.js";
import LeafletMap from "./LeafletMap.js";
import Popup from "../Popups/Popup.js";
import NoResults from "../Popups/NoResults.js";
import NoSend from "../Popups/NoSend.js";
import Navbar from "../Navbar/Navbar.js";
import credentials from "../../credentials.json";
import * as helper from "../Utils/Helpers.js";
import * as query from "../Utils/Queries.js";
import translate from "../../Assets/indexes/translate.json"

/////////////////////////////////////////////////////////////////////////////////////////////////////
// COMPONENT ////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

class MapView extends Component {

//STATE CONSTRUCTOR ////////////////////////////////////////////////////////////////////////////////
  constructor(props) {
    super(props);
    this.state = {
      language: "en",
      //FILTER INPUTS
      sent_id: "init",
      kind: "People",
      given_name_western: "",
      family_name_western: "",
      name_western: "",
      religious_family: "All",
      institution_category: "All",
      institution_subcategory: "All",
      event_category: "All",
      event_subcategory: "All",
      gender: "All",
      nationality: "All",
      location: "All",
      affiliation: "All",
      start_year: "",
      end_year: "",
      key: Math.random(),
      // DATA ARRAYS & SELECT NODE
      nodeArray: [],
      selectArray: [],
      breadCrumb: [],
      nodeSelect: "",
      inputValuePAff: "",
      inputValueAff: "",
      inputValueNat: "",
      // DISPLAY CONTROLS
      popupcontainer: "popupcontainer hide",
      filterDisplay: "filter_container",
      addinfo: "addinfo hide",
      noresults: "noresults hide",
      nosend: "nosend hide",
      addinfortext: "additional_info",
      // FORM SELECTS
      instCatsIndex: [],
      eventsCatsIndex: [],
      relFamIndex: [],
      affIndex: [],
      pAffIndex: [],
      natIndex: [],
      placeIndex: [],
      // LOAD STATES
      content: "loaded",
      natIsLoading: true,
      //MAP BOUNDS
      mapBounds: [[54.31,137.28],[18.312,71.63],],
    };

//INITIATE NEO4J INSTANCE ///////////////////////////////////////////////////////////////////////////
    this.driver = neo4j.driver(
      credentials.port,
      neo4j.auth.basic(credentials.username, credentials.password),
      { disableLosslessIntegers: true }
    );
// BIND UTILITY FUNCTIONS TO THIS CONTEXT ///////////////////////////////////////////////////////////
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
    this.handleMapInputChange = helper.handleMapInputChange.bind(this);
    this.handleMapAffInputChange = helper.handleMapAffInputChange.bind(this);
    this.handleMapNatInputChange = helper.handleMapNatInputChange.bind(this);
    this.fetchMapIndexes = query.fetchMapIndexes.bind(this);
    this.fetchPAffIndex = query.fetchPAffIndex.bind(this);
    this.fetchAffIndex = query.fetchAffIndex.bind(this);
    this.fetchNatIndex = query.fetchNatIndex.bind(this);
    this.toggleDisplay = helper.toggleDisplay.bind(this);
    this.langSwitch = helper.langSwitch.bind(this);
    this.linkCheck = helper.linkCheck.bind(this);
    this.handleChangeData = helper.handleChangeData.bind(this);
  };


//RUN ON COMPONENT MOUNT /////////////////////////////////////////////////////////////////////////////
  componentDidMount() {

    this.fetchMapIndexes();

    let receivedLang = this.props.location.langGive;
    let receivedKind = this.props.location.kind;
    let receivedGiveName = this.props.location.given_name_western;
    let receivedFamName = this.props.location.family_name_western;
    let receivedName = this.props.location.name_western;
    let receivedId = this.props.location.sent_id;
    let receivedAff = this.props.location.corp_name_western;
    if (receivedLang) {this.setState({ language: receivedLang })};
    if (receivedKind) {this.setState({ kind: receivedKind })};
    if (receivedGiveName) {this.setState({ given_name_western: receivedGiveName })};
    if (receivedFamName) {this.setState({ family_name_western: receivedFamName })};
    if (receivedName) {this.setState({ name_western: receivedName })};
    if (receivedId) {this.setState({ sent_id: receivedId })};
    if (receivedAff) {this.setState({ affiliation: receivedAff })};

    setTimeout(() => {
      if (this.state.sent_id === "init" && this.state.affiliation === "All" ) {return null}
      else  {this.fetchResults()}
    } , 1500);
  };


//RENDER ////////////////////////////////////////////////////////////////////////////////////////////
  render() {

    const linkTarget = {
    pathname: "/map",
    key: Math.random(),
    state: {
      applied: true
      }
    };

    return (
      <div>
        <Helmet>
          <html lang={this.state.language} />
          <title>{translate[0]["chcd_name"][this.state.language]} - {translate[0]["map"][this.state.language]}</title>
        </Helmet>
        <Navbar language={this.state.language} langSwitch={this.langSwitch}/>
        <NoSend
          nosend={this.state.nosend}
          language={this.state.language}
          toggleDisplay = {this.toggleDisplay}
        />
        <NoResults
          noresults={this.state.noresults}
          language={this.state.language}
          toggleDisplay = {this.toggleDisplay}
        />
        <FilterMap
          {...this.state}
          handleChange={this.handleChange}
          resetFilter={this.resetFilter}
          fetchResults={this.fetchResults}
          fetchPAffIndex={this.fetchPAffIndex}
          fetchAffIndex={this.fetchAffIndex}
          fetchNatIndex={this.fetchNatIndex}
          handleMapInputChange={this.handleMapInputChange}
          handleMapNatInputChange={this.handleMapNatInputChange}
          handleMapAffInputChange={this.handleMapAffInputChange}
          filterHide={this.filterHide}
          handleFormChange={this.handleFormChange}
          handleChangeData={this.handleChangeData}
        />
        <LeafletMap
          language={this.state.language}
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
          linkCheck={this.linkCheck}
        />
      </div>
    )
  }

}

/////////////////////////////////////////////////////////////////////////////////////////////////////
// EXPORT //////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

export default MapView
