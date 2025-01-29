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
import { useLocation, useSearchParams } from 'react-router-dom';
import categoryIndex from "../../Assets/indexes/category_indexes.json";

export function withRouter(Children){
  return(props)=>{
     const match  = {params: useLocation()};
     const [searchParams, setSearchParams] = useSearchParams();
     return <Children 
      {...props}  
      match = {match} 
      searchParams = {searchParams} 
      setSearchParams={setSearchParams} 
    />
 }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////
// COMPONENT ////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

class MapView extends React.Component {

//STATE CONSTRUCTOR ////////////////////////////////////////////////////////////////////////////////
  constructor(props) {

    super(props);
    this.state = {
      language: "en",
      cite: "cite hide",
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
      printArray: [],
      basicArray: [],
      inputValuePAff: "",
      inputValueAff: "",
      inputValueNat: "",
      // DISPLAY CONTROLS
      popupcontainer: "popupcontainer hide",
      filterDisplay: "filter_container",
      addinfo: "addinfo",
      addpers: "addpers",
      addinst: "addinst",
      addevent: "addevent",
      addcorp: "addcorp",
      addpub: "addpub",
      addinfortext: "hide_additional_info",
      addperstext: "hide_additional_info",
      addinsttext: "hide_additional_info",
      addeventtext: "hide_additional_info",
      addcorptext: "hide_additional_info",
      addpubtext: "hide_additional_info",
      noresults: "noresults hide",
      nosend: "nosend hide",
      // FORM SELECTS
      instCatsIndex: categoryIndex.instCatsIndex,
      eventsCatsIndex: categoryIndex.eventsCatsIndex,
      relFamIndex: [],
      affIndex: [],
      pAffIndex: [],
      natIndex: [],
      placeIndex: [],
      // LOAD STATES
      content: "loaded",
      natIsLoading: true,
      append: 0,
      //MAP BOUNDS
      mapBounds: [[54.31,137.28],[18.312,71.63],]
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
    this.toggleCite = helper.toggleCite.bind(this);
    this.langSwitch = helper.langSwitch.bind(this);
    this.linkCheck = helper.linkCheck.bind(this);
    this.handleChangeData = helper.handleChangeData.bind(this);
    this.getCitation = helper.getCitation.bind(this); 
  };

 
//RUN ON COMPONENT MOUNT /////////////////////////////////////////////////////////////////////////////
  componentDidMount() {

    if (this.props.match.params.search) {
      const urlSearch = "permalink";
      this.setState({ search: urlSearch });
      console.log(urlSearch)
      };

    this.fetchMapIndexes();

    if (this.props.match.params.state == null ) {} else {
      if (this.props.match.params.state.langgive) {
        this.setState({ language: this.props.match.params.state.langgive }); 
      };
      if (this.props.match.params.state.kind) {
        this.setState({ kind: this.props.match.params.state.kind }); 
      };
      if (this.props.match.params.state.given_name_western) {
        this.setState({ given_name_western: this.props.match.params.state.given_name_western }); 
      };
      if (this.props.match.params.state.family_name_western) {
        this.setState({ family_name_western: this.props.match.params.state.family_name_western }); 
      };
      if (this.props.match.params.state.name_western) {
        this.setState({ name_western: this.props.match.params.state.name_western }); 
      };
      if (this.props.match.params.state.corp_name_western) {
        this.setState({ affiliation: this.props.match.params.state.corp_name_western }); 
      };
      if (this.props.match.params.state.sent_id) {
        this.setState({ sent_id: this.props.match.params.state.sent_id }); 
      };
    };

    if (this.props.match.params.search === "" ) {} else {
      if (this.props.searchParams.get('sent_id') !== "" ) {
        const info = this.props.searchParams.get('sent_id'); console.log(info)
        this.setState({ sent_id: info }); 
      };
      if (this.props.searchParams.get('kind') !== "" ) {
        const info = this.props.searchParams.get('kind'); console.log(info)
        this.setState({ kind: info }); 
      };
      if (this.props.searchParams.get('given_name_western') !== "" ) {
        const info = this.props.searchParams.get('given_name_western'); console.log(info)
        this.setState({ given_name_western: info }); 
      };
      if (this.props.searchParams.get('family_name_western') !== "" ) {
        const info = this.props.searchParams.get('family_name_western'); console.log(info)
        this.setState({ family_name_western: info }); 
      };
      if (this.props.searchParams.get('name_western') !== "" ) {
        const info = this.props.searchParams.get('name_western'); console.log(info)
        this.setState({ name_western: info }); 
      };
      if (this.props.searchParams.get('religious_family') !== "" ) {
        const info = this.props.searchParams.get('religious_family'); console.log(info)
        this.setState({ religious_family: info }); 
      };
      if (this.props.searchParams.get('institution_category') !== "" ) {
        const info = this.props.searchParams.get('institution_category'); console.log(info)
        this.setState({ institution_category: info }); 
      };
      if (this.props.searchParams.get('institution_subcategory') !== "" ) {
        const info = this.props.searchParams.get('institution_subcategory'); console.log(info)
        this.setState({ institution_subcategory: info }); 
      };
      if (this.props.searchParams.get('event_category') !== "" ) {
        const info = this.props.searchParams.get('event_category'); console.log(info)
        this.setState({ event_category: info }); 
      };
      if (this.props.searchParams.get('event_subcategory') !== "" ) {
        const info = this.props.searchParams.get('event_subcategory'); console.log(info)
        this.setState({ event_subcategory: info }); 
      };
      if (this.props.searchParams.get('gender') !== "" ) {
        const info = this.props.searchParams.get('gender'); console.log(info)
        this.setState({ gender: info }); 
      };
      if (this.props.searchParams.get('nationality') !== "" ) {
        const info = this.props.searchParams.get('nationality'); console.log(info)
        this.setState({ nationality: info }); 
      };
      if (this.props.searchParams.get('location') !== "" ) {
        const info = this.props.searchParams.get('location'); console.log(info)
        this.setState({ location: info }); 
      };
      if (this.props.searchParams.get('affiliation') !== "" ) {
        const info = this.props.searchParams.get('affiliation'); console.log(info)
        this.setState({ affiliation: info }); 
      };
      if (this.props.searchParams.get('start_year') !== "" ) {
        const info = this.props.searchParams.get('start_year'); console.log(info)
        this.setState({ start_year: info }); 
      };
      if (this.props.searchParams.get('end_year') !== "" ) {
        const info = this.props.searchParams.get('end_year'); console.log(info)
        this.setState({ end_year: info }); 
      };
    };

    setTimeout(() => {
      if (this.state.search === "permalink") {this.fetchResults()}
      else if (this.state.sent_id === "init" && this.state.affiliation === "All") {return null}
      else {this.fetchResults()}
    } , 1500);
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.state.append !== prevState.append
    ) {this.props.setSearchParams({
        sent_id: this.state.sent_id,
        kind: this.state.kind,
        given_name_western: this.state.given_name_western,
        family_name_western: this.state.family_name_western,
        name_western: this.state.name_western,
        religious_family: this.state.religious_family,
        institution_category: this.state.institution_category,
        institution_subcategory: this.state.institution_subcategory,
        event_category: this.state.event_category,
        event_subcategory: this.state.event_subcategory,
        gender: this.state.gender,
        nationality: this.state.nationality,
        location: this.state.location,
        affiliation: this.state.affiliation,
        start_year: this.state.start_year,
        end_year: this.state.end_year
    });}
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
        <Navbar
          language={this.state.language}
          langSwitch={this.langSwitch}
          toggleCite = {this.toggleCite}
        />
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
          {...this.state}
          language={this.state.language}
          content={this.state.content}
          nodeArray={this.state.nodeArray}
          bounds={this.state.mapBounds}
          breadCrumbChainer={this.breadCrumbChainer}
          selectSwitchInitial={this.selectSwitchInitial}
          getCitation={this.getCitation}
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
          getCitation={this.getCitation}
        />
      </div>
    )
  }

}

/////////////////////////////////////////////////////////////////////////////////////////////////////
// EXPORT //////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

export default withRouter(MapView);
