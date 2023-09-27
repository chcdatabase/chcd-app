/////////////////////////////////////////////////////////////////////////////////////////////////////
// IMPORTS //////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react'
import neo4j from "neo4j-driver/lib/browser/neo4j-web";
import FilterNetwork from "./FilterNetwork.js";
import EgoGraph from "./EgoGraph.js";
import Popup from "../Popups/Popup.js";
import NoResults from "../Popups/NoResults.js";
import NoSend from "../Popups/NoSend.js";
import Navbar from "../Navbar/Navbar.js";
import NetworkKey from './NetworkKey.js'
import {Helmet} from "react-helmet";
import translate from "../../Assets/indexes/translate.json"
import credentials from "../../credentials.json";
import * as helper from "../Utils/Helpers.js";
import * as query from "../Utils/Queries.js";
import { useLocation, useSearchParams } from 'react-router-dom';

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

class NetworkView extends React.Component {

//STATE CONSTRUCTOR ////////////////////////////////////////////////////////////////////////////////
  constructor(props) {
    super(props);
    this.state = {
      language: "en",
      cite: "cite hide",
      //FILTER INPUTS
      sent_id: "init",
      people_include: false,
      corp_include: false,
      inst_include: false,
      event_include: false,
      pub_include: false,
      node_id: "",
      given: "",
      degree: 1,
      start_year: "",
      end_year: "",
      time_disable: true,
      search: "",
      // DATA ARRAYS & SELECT NODE
      nodeArray: [],
      selectArray: [],
      nodeSelect: "",
      breadCrumb: [],
      printArray: [],
      basicArray: [],
      selectedOption: "",
      inputValue: "",
      sentInputValue: "",
      // DISPLAY CONTROLS
      popupcontainer: "popupcontainer hide",
      filterDisplay: "filter_container",
      addinfo: "addinfo",
      addpers: "addpers",
      addinst: "addinst",
      addevent: "addevent",
      addcorp: "addcorp",
      addcorp: "addpub",
      addinfortext: "hide_additional_info",
      addperstext: "hide_additional_info",
      addinsttext: "hide_additional_info",
      addeventtext: "hide_additional_info",
      addcorptext: "hide_additional_info",
      addpubtext: "hide_additional_info",
      noresults: "noresults hide",
      nosend: "nosend hide",
      networkKey: "addinfo hide",
      keyBorder: "rounded",
      // FORM SELECTS
      netPersonIndex: [],
      // LOAD STATES
      content: "loaded",
      append: 0,
    }
//INITIATE NEO4J INSTANCE ///////////////////////////////////////////////////////////////////////////
    this.driver = neo4j.driver(
      credentials.port,
      neo4j.auth.basic(credentials.username, credentials.password),
      { disableLosslessIntegers: true }
    );
// BIND UTILITY FUNCTIONS TO THIS CONTEXT ///////////////////////////////////////////////////////////
    this.fetchNetworkResults = query.fetchNetworkResults.bind(this);
    this.fetchNetworkConfines = query.fetchNetworkConfines.bind(this);
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
    this.handleOptionChange = helper.handleOptionChange.bind(this);
    this.handleInputChange  = helper.handleInputChange .bind(this);
    this.toggleDisplay = helper.toggleDisplay.bind(this);
    this.toggleCite = helper.toggleCite.bind(this);
    this.langSwitch = helper.langSwitch.bind(this);
    this.linkCheck = helper.linkCheck.bind(this);
    this.hideKey = helper.hideKey.bind(this);
    this.getCitation = helper.getCitation.bind(this);

  };

//RUN ON COMPONENT MOUNT /////////////////////////////////////////////////////////////////////////
  componentDidMount() {
    if (this.props.match.params.search) {
      const urlSearch = "permalink";
      this.setState({ search: urlSearch });
      };
    if (this.props.match.params.state == null ) {} else {
      if (this.props.match.params.state.langgive) {
        this.setState({ language: this.props.match.params.state.langgive }); 
      };
      if (this.props.match.params.state.sent_id) {
        this.setState({ sent_id: this.props.match.params.state.sent_id }); 
        this.setState({ node_id: this.props.match.params.state.sent_id }); 
        this.setState({ degree: 1 });
        this.setState({ people_include: true });
        this.setState({ inst_include: true });
        this.setState({ corp_include: true });
        this.setState({ event_include: true });
        this.setState({ selectedOption: this.props.match.params.state.selected_option  });
        this.setState({ inputValue: this.props.match.params.state.input_value  });
      };
    };

    if (this.props.match.params.search === "" ) {} else {
      if (this.props.searchParams.get('sent_id') !== "" ) {
        const info = this.props.searchParams.get('sent_id');
        this.setState({ sent_id: info }); 
      };
      if (this.props.searchParams.get('node_id') !== "" ) {
        const info = this.props.searchParams.get('node_id');
        this.setState({ node_id: info });
      };
      if (this.props.searchParams.get('selectedOption') !== "" ) {
        const info = this.props.searchParams.get('selectedOption');
        this.setState({ selectedOption: info }); 
      };
      if (this.props.searchParams.get('node_id') !== "" ) {
        const info = this.props.searchParams.get('node_id');
        this.setState({ node_id: info }); 
      };
      if (this.props.searchParams.get('sentInputValue') !== "" ) {
        const info = this.props.searchParams.get('sentInputValue');
        this.setState({ inputValue: info })
        this.setState({ sentInputValue: info })
      };
      if (this.props.searchParams.get('degree') !== "" ) {
        const info = this.props.searchParams.get('degree');
        this.setState({ degree: info }); 
      };
      if (this.props.searchParams.get('people_include') !== "" ) {
        const info = this.props.searchParams.get('people_include');
        if (info === 'false') {} else { this.setState({ people_include: Boolean(info) })}; 
      };
      if (this.props.searchParams.get('inst_include') !== "" ) {
        const info = this.props.searchParams.get('inst_include');
        if (info === 'false') {} else { this.setState({ inst_include: Boolean(info) })};
      };
      if (this.props.searchParams.get('corp_include') !== "" ) {
        const info = this.props.searchParams.get('corp_include');
        if (info === 'false') {} else { this.setState({ corp_include: Boolean(info) })}; 
      };
      if (this.props.searchParams.get('event_include') !== "" ) {
        const info = this.props.searchParams.get('event_include');
        if (info === 'false') {} else { this.setState({ event_include: Boolean(info) })}; 
      };
      if (this.props.searchParams.get('pub_include') !== "" ) {
        const info = this.props.searchParams.get('pub_include');
        if (info === 'false') {} else { this.setState({ pub_include: Boolean(info) })}; 
      };
      if (this.props.searchParams.get('start_year') !== "" ) {
        const info = this.props.searchParams.get('start_year');
        this.setState({ start_year: info}); 
      };
      if (this.props.searchParams.get('end_year') !== "" ) {
        const info = this.props.searchParams.get('end_year');
        this.setState({ end_year: info }); 
      };
    };

    setTimeout(() => {
      if (this.state.search === "permalink") {this.fetchNetworkResults()}
      else if (this.state.sent_id === "init") {return null}
      else {this.fetchNetworkResults()}
    } , 1500)
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.state.append !== prevState.append
    ) {this.props.setSearchParams({
        sent_id: this.state.sent_id,
        node_id: this.state.node_id,
        degree: this.state.degree,
        selectedOption: this.state.selectedOption,
        sentInputValue: this.state.sentInputValue,
        start_year: this.state.start_year,
        end_year: this.state.end_year,
        people_include: this.state.people_include,
        corp_include: this.state.corp_include,
        inst_include: this.state.inst_include,
        event_include: this.state.event_include,
        pub_include: this.state.pub_include
    });}
  };

//RENDER ////////////////////////////////////////////////////////////////////////////////////////////
  render() {
    return (
      <div>
        <Helmet>
          <html lang={this.state.language} />
          <title>{translate[0]["chcd_name"][this.state.language]} - {translate[0]["network"][this.state.language]}</title>
        </Helmet>
        <Navbar
          language={this.state.language}
          langSwitch={this.langSwitch}
          toggleCite = {this.toggleCite}
        />
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
          handleOptionChange={this.handleOptionChange}
          handleInputChange ={this.handleInputChange }
          handleCheck={this.handleCheck}
          resetFilter={this.resetFilter}
          fetchNetworkResults={this.fetchNetworkResults}
          filterHide={this.filterHide}
          fetchNetworkIndexes={this.fetchNetworkIndexes}
          handleChangeData={this.handleChangeData}
        />
        <EgoGraph
          {...this.state}
          content= {this.state.content}
          nodeArray={this.state.nodeArray}
          node_id={this.state.node_id}
          breadCrumbChainer={this.breadCrumbChainer}
          selectSwitchInitial={this.selectSwitchInitial}
          language={this.state.language}
          filterDisplay={this.state.filterDisplay}
          getCitation={this.getCitation}
        />
        <NetworkKey
          networkKey={this.state.networkKey}
          keyBorder={this.state.keyBorder}
          hideKey={this.hideKey}
          language={this.state.language}
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

export default withRouter(NetworkView)
