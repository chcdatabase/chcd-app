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
import Citation from "../Popups/Citation.js";
import {Helmet} from "react-helmet";
import translate from "../../Assets/indexes/translate.json"
import credentials from "../../credentials.json";
import * as helper from "../Utils/Helpers.js";
import * as query from "../Utils/Queries.js";

/////////////////////////////////////////////////////////////////////////////////////////////////////
// COMPONENT ////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

class NetworkView extends Component {

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
      node_id: "",
      given: "",
      degree: 1,
      start_year: "",
      end_year: "",
      time_disable: true,
      // DATA ARRAYS & SELECT NODE
      nodeArray: [],
      selectArray: [],
      nodeSelect: "",
      breadCrumb: [],
      selectedOption: "",
      inputValue: '',
      // DISPLAY CONTROLS
      popupcontainer: "popupcontainer hide",
      filterDisplay: "filter_container",
      addinfo: "addinfo",
      addpers: "addpers",
      addinst: "addinst",
      addevent: "addevent",
      addcorp: "addcorp",
      addinfortext: "hide_additional_info",
      addperstext: "hide_additional_info",
      addinsttext: "hide_additional_info",
      addeventtext: "hide_additional_info",
      addcorptext: "hide_additional_info",
      noresults: "noresults hide",
      nosend: "nosend hide",
      networkKey: "addinfo hide",
      keyBorder: "rounded",
      // FORM SELECTS
      netPersonIndex: [],
      // LOAD STATES
      content: "loaded",
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
  };

//RUN ON COMPONENT MOUNT /////////////////////////////////////////////////////////////////////////
  componentDidMount() {

    let receivedLang = this.props.location.langGive;
    let receivedId = this.props.location.sent_id;
    let receivedType = this.props.location.selectedOption;
    let receivedInput = this.props.location.inputValue;
    if (receivedLang) {this.setState({ language: receivedLang })};
    if (receivedId) {
      this.setState({ sent_id: receivedId });
      this.setState({ node_id: receivedId });
      this.setState({ degree: 1 });
      this.setState({ people_include: true });
      this.setState({ inst_include: true });
      this.setState({ selectedOption: receivedType });
      this.setState({ inputValue: receivedInput });
    };
    setTimeout(() => {
      if (this.state.sent_id === "init") {return null}
      else {this.fetchNetworkResults()}
    } , 1000)
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
        <Citation
          cite={this.state.cite}
          language={this.state.language}
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
          content= {this.state.content}
          nodeArray={this.state.nodeArray}
          node_id={this.state.node_id}
          breadCrumbChainer={this.breadCrumbChainer}
          selectSwitchInitial={this.selectSwitchInitial}
          language={this.state.language}
          filterDisplay={this.state.filterDisplay}
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
        />
      </div>
    )
  }

}

/////////////////////////////////////////////////////////////////////////////////////////////////////
// EXPORT //////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

export default NetworkView
