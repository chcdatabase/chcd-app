/////////////////////////////////////////////////////////////////////////////////////////////////////
// IMPORTS //////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react'
import neo4j from "neo4j-driver/lib/browser/neo4j-web";
import {Helmet} from "react-helmet";
import FilterSearch from "./FilterSearch.js";
import SearchResults from "./SearchResults.js"
import Popup from "../Popups/Popup.js";
import NoResults from "../Popups/NoResults.js";
import Navbar from "../Navbar/Navbar.js";
import credentials from "../../credentials.json";
import * as helper from "../Utils/Helpers.js";
import * as query from "../Utils/Queries.js";
import translate from "../../Assets/indexes/translate.json"
import { useLocation, useSearchParams } from 'react-router-dom';

export function withRouter(Children){
  return(props)=>{
     const match  = {params: useLocation()};
     const [searchParams, setSearchParams] = useSearchParams();
     const searchGet = searchParams.get('search')
     return <Children 
      {...props}  
      match = {match} 
      searchParams = {searchParams} 
      searchGet = {searchGet}
      setSearchParams={setSearchParams} 
    />
 }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////
// COMPONENT ////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

class SearchView extends React.Component {

//STATE CONSTRUCTOR ////////////////////////////////////////////////////////////////////////////////
  constructor(props) {
    super(props);
    this.state = {
      language: "en",
      cite: "cite hide",
      //FILTER INPUTS
      search: "",
      searchSet: "",
      start_year: "",
      end_year: "",
      // DATA ARRAYS & SELECT NODE
      nodeArray: [],
      selectArray: [],
      breadCrumb: [],
      nodeSelect: "",
      printArray: [],
      basicArray: [],
      // AVAILABLE FILTERS
      labelList: [],
      genderList: [],
      nationalityList: [],
      filterArray: [],
      relFamList: [],
      christTradList: [],
      instCatList: [],
      instSubCatList: [],
      corpCatList: [],
      corpSubCatList: [],
      eventCatList: [],
      eventSubCatList: [],
      pubCatList: [],
      pubSubCatList: [],
      affList: [],
      instList: [],
      provList: [],
      prefList: [],
      countyList: [],
      //FILTER VALUES
      label: "",
      nationality: "",
      gender: "",
      religious_family: "",
      christian_tradition: "",
      institution_category: "",
      institution_subcategory: "",
      corporate_entity_category: "",
      corporate_entity_subcategory: "",
      event_category: "",
      event_subcategory: "",
      publication_category: "",
      publication_subcategory: "",
      name_western: "",
      inst_name_western: "",
      province: "",
      prefecture: "",
      county: "",
      // DISPLAY CONTROLS
      popupcontainer: "popupcontainer hide",
      filterDisplay: "filter_container",
      addinfo: "addinfo",
      addpers: "addpers",
      addinst: "addinst",
      addevent: "addevent",
      addcorp: "addcorp",
      addpub: "addpub",
      addgeo: "addgeo",
      addinfortext: "hide_additional_info",
      addperstext: "hide_additional_info",
      addinsttext: "hide_additional_info",
      addeventtext: "hide_additional_info",
      addcorptext: "hide_additional_info",
      addpubtext: "hide_additional_info",
      addgeotext: "hide_additional_info",
      noresults: "noresults hide",
      // FORM SELECTS
      instCatsIndex: [],
      relFamIndex: [],
      affIndex: [],
      pAffIndex: [],
      natIndex: [],
      // LOAD STATES
      content: "loaded"
    };

//INITIATE NEO4J INSTANCE ///////////////////////////////////////////////////////////////////////////
    this.driver = neo4j.driver(
      credentials.port,
      neo4j.auth.basic(credentials.username, credentials.password),
      { disableLosslessIntegers: true }
    );
// BIND UTILITY FUNCTIONS TO THIS CONTEXT ///////////////////////////////////////////////////////////
    this.fetchResults = query.fetchResults.bind(this);
    this.fetchSearch = query.fetchSearch.bind(this);
    this.selectSwitchInitial = query.selectSwitchInitial.bind(this);
    this.selectSwitchAppend = query.selectSwitchAppend.bind(this);
    this.selectSwitchReduce = query.selectSwitchReduce.bind(this);
    this.breadCrumbChainer = helper.breadCrumbChainer.bind(this);
    this.breadCrumbReducer = helper.breadCrumbReducer.bind(this);
    this.handleChange = helper.handleChange.bind(this);
    this.handleFilterCheck = helper.handleFilterCheck.bind(this);
    this.filterHide = helper.filterHide.bind(this);
    this.resetFilter = helper.resetFilter.bind(this);
    this.handleFormChange = helper.handleFormChange.bind(this);
    this.fetchMapIndexes = query.fetchMapIndexes.bind(this);
    this.toggleDisplay = helper.toggleDisplay.bind(this);
    this.toggleCite = helper.toggleCite.bind(this);
    this.handleKeyPress = helper.handleKeyPress.bind(this);
    this.filterResults = helper.filterResults.bind(this);
    this.clearFilters = helper.clearFilters.bind(this);
    this.langSwitch = helper.langSwitch.bind(this);
    this.linkCheck = helper.linkCheck.bind(this);
    this.reFilterSet = helper.reFilterSet.bind(this);
    this.getCitation = helper.getCitation.bind(this);
  };

//RUN ON COMPONENT MOUNT /////////////////////////////////////////////////////////////////////////
  componentDidMount() {
    if (this.props.match.params.search) {
      const urlSearch = this.props.searchGet;
      this.setState({ search: urlSearch });
      this.setState({ searchSet: urlSearch });

      if (this.props.searchParams.get('nodeSelect') !== "" ) {
        const info = this.props.searchParams.get('nodeSelect');
        this.setState({ nodeSelect: info }); 
        if (this.props.searchParams.get('search')) {
          this.selectSwitchInitial(info); 
          this.setState({ filterDisplay: "filter_container" });
          this.setState({ popupcontainer: "popupcontainer" });
        }
        else {
          this.setState({ search: "" }); 
          this.selectSwitchInitial(info); 
          this.setState({ filterDisplay: "filter_container2" });
          this.setState({ popupcontainer: "popupcontainer-full" });
        } 
      };
    };

    if (this.props.match.params.state == null ) {} else {
      if (this.props.match.params.state.langgive) {
      this.setState({ language: this.props.match.params.state.langgive }); 
      }
    };

    setTimeout(() => {
      if (this.state.search === "" && this.state.searchSet === "" ) {return null}
      if (this.state.search === "null" && this.state.searchSet === "null" ) {return null}
      else  {this.fetchSearch()}
    } , 500);

  };

  componentDidUpdate(prevProps, prevState) {
    if (this.state.content === "loaded" && this.state.searchSet !== null && (
          this.state.searchSet !== prevState.searchSet ||
          this.state.nodeSelect !== prevState.nodeSelect )
    ) {this.props.setSearchParams({
      search: this.state.searchSet,
      nodeSelect: this.state.nodeSelect
    });}
  };

  
//RENDER ////////////////////////////////////////////////////////////////////////////////////////
  render() {
    return (
      <div>
        <Helmet>
          <html lang={this.state.language} />
          <title>{translate[0]["chcd_name"][this.state.language]} - {translate[0]["explore"][this.state.language]}</title>
        </Helmet>
        <Navbar
          language={this.state.language}
          langSwitch={this.langSwitch}
          toggleCite = {this.toggleCite}
        />
        <NoResults
          noresults={this.state.noresults}
          language={this.state.language} l
          toggleDisplay = {this.toggleDisplay}
        />
        <FilterSearch
          {...this.state}
          params={this.props.match.params}
          selectSwitchInitial={this.clickHandler}
          handleChange={this.handleChange}
          resetFilter={this.resetFilter}
          fetchResults={this.fetchResults}
          filterHide={this.filterHide}
          handleFormChange={this.handleFormChange}
          handleFilterCheck={this.handleFilterCheck}
          filterResults={this.filterResults}
          clearFilters={this.clearFilters}
        />
        <SearchResults
          {...this.state}
          handleKeyPress={this.handleKeyPress}
          fetchSearch={this.fetchSearch}
          handleChange={this.handleChange}
          breadCrumbChainer={this.breadCrumbChainer}
          selectSwitchInitial={this.selectSwitchInitial}
          linkCheck={this.linkCheck}
          reFilterSet={this.reFilterSet}
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

export default withRouter(SearchView)
