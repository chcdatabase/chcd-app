// IMPORTS ////////////////////////////////////////////////////////////////////
import Navbar from "../Navbar/Navbar.js";
import FilterDataDash from "./FilterDataDash.js";
//import Popup from "../Popups/Popup.js";
import NoResults from "../Popups/NoResults.js";
import NoSend from "../Popups/NoSend.js";
import {Helmet} from "react-helmet";
import DataResults from "./DataResults.js"
import Popup from "../Popups/Popup.js";
// MAIN DEPENDENCIES
import React, { Component } from "react";
import neo4j from "neo4j-driver/lib/browser/neo4j-web";
// HELPER FILES
import credentials from "../../credentials.json";
import translate from "../../Assets/indexes/translate.json"
import * as query from "../Utils/Queries.js";
import * as helper from "../Utils/Helpers.js";
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

class DataView extends React.Component {
    //STATE, PROPS, DRIVER INFO, & BINDS
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
            kind: "",
            // DATA ARRAYS & SELECT NODE
            nodeArray: [],
            printArray: [],
            basicArray:[],
            selectArray: [],
            nodeSelect: "",
            breadCrumb: [],
            selectedOption: "All",
            inputValue: '',
            // DISPLAY CONTROLS
            popupcontainer: "popupcontainer hide",
            filterDisplay: "filter_data_container",
            addinfo: "addinfo",
            addpers: "addpers",
            addinst: "addinst",
            addevent: "addevent",
            addpub: "addpub",
            addcorp: "addcorp",
            addgeo: "addgeo",
            addinfortext: "hide_additional_info",
            addperstext: "hide_additional_info",
            addinsttext: "hide_additional_info",
            addeventtext: "hide_additional_info",
            addcorptext: "hide_additional_info",
            addpubtext: "hide_additional_info",
            addgeotext: "hide_additional_info",
            noresults: "noresults hide",
            nosend: "nosend hide",
            networkKey: "addinfo hide",
            keyBorder: "rounded",
            // FORM SELECTS
            netPersonIndex: [],
            // LOAD STATES
            content: "loaded",
            append: 0,
            // QUERIES
            totalPeople: "",
            totalRelationships: "",
            totalInstitutions: "",
            totalEvents: "",
            totalPublications: "",
            totalNodes: "",
            totalCorporateEntities: "",
            genders: "",
            provinces:"",
            prefectures:"",
            counties:"",
            nationality:"",
            nationalityNull:"",
            christianTradition: "",
            religiousFamily: "",
            religiousFamilyNullValues: "",
            christianTraditionNullValues: "",
            instDateList: "",
            genderList: "",
            instTypeList: "",
            corpOptions: "",
            instOptions: "",
            geoOptions: "",
            dataOptions: ""
        };

        // INITIATE NEO4J INSTANCE
        this.driver = neo4j.driver(credentials.port, neo4j.auth.basic(credentials.username, credentials.password), {
            disableLosslessIntegers: true
        });
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
        this.handleInputChange  = helper.handleInputChange.bind(this);
        this.toggleDisplay = helper.toggleDisplay.bind(this);
        this.toggleCite = helper.toggleCite.bind(this);
        this.langSwitch = helper.langSwitch.bind(this);
        this.linkCheck = helper.linkCheck.bind(this);
        this.hideKey = helper.hideKey.bind(this);
        this.toggleCite = helper.toggleCite.bind(this);
        this.renameProperty = helper.renameProperty.bind(this);
        this.handleChangeDataDD = helper.handleChangeDataDD.bind(this);
        this.getCitation = helper.getCitation.bind(this);
        this.clearFilters = helper.clearFilters.bind(this);

        // QUERIES
        this.fetchDBWide = query.fetchDBWide.bind(this);
        this.fetchCorporateEntitiesData = query.fetchCorporateEntitiesData.bind(this);
        this.fetchInstitutionsData = query.fetchInstitutionsData.bind(this);
        this.fetchGeographyData = query.fetchGeographyData.bind(this);
        this.fetchCorpOptions = query.fetchCorpOptions.bind(this);
        this.fetchInstOptions = query.fetchInstOptions.bind(this);
        this.fetchGeoOptions = query.fetchGeoOptions.bind(this);
    }

    //RUN ON COMPONENT MOUNT/UPDATE //////////////////////////////////////////////////////
    componentDidMount() {

      this.fetchCorpOptions();this.fetchInstOptions();this.fetchGeoOptions();

      //FROM EXTERNAL PERMALINK (I.E., PULLS DATA FROM URL)
      if (this.props.match.params.search) {
        const urlSearch = "permalink";
        this.setState({ search: urlSearch });
        };

        if (this.props.match.params.search === "" ) {} else {
          if (this.props.searchParams.get('node_id') !== "" ) {
            const info = this.props.searchParams.get('node_id');
            this.setState({ sent_id: info });
            this.setState({ node_id: info }); 
          };
          if (this.props.searchParams.get('kind') !== "" ) {
            const info = this.props.searchParams.get('kind');
            this.setState({ selectedOption: info });
          };
          if (this.props.searchParams.get('kind') === "All" ) {
            const info = this.props.searchParams.get('kind');
            this.setState({ selectedOption: "" });
          };
        };

      //FROM INTERNAL LINK (I.E., PULLS DATA FROM PASSED STATE)
      if (this.props.match.params.state == null ) {
      } else {
        if (this.props.match.params.state.langgive) {this.setState({ language: this.props.match.params.state.langgive })};
        if (this.props.match.params.state.sent_id) {
          this.setState({ node_id: this.props.match.params.state.sent_id })
          this.setState({ sent_id: this.props.match.params.state.sent_id })
        };
        if (this.props.match.params.state.kind) {
          this.setState({ selectedOption: this.props.match.params.state.kind })
        };
      };

      //TIMED UPDATE IF PROPS RECEIVED
      setTimeout(() => {
        if (this.state.sent_id === "init") {this.fetchDBWide();}
        else {
          if (this.state.selectedOption === "Institution") {this.fetchInstitutionsData();}
          if (this.state.selectedOption === "CorporateEntity") {this.fetchCorporateEntitiesData();}
          if (this.state.selectedOption === "Geography") {this.fetchGeographyData();}
          if (this.state.selectedOption === "All") {this.fetchDBWide();}
          else {return null}
        }
      } , 500)
    };

    //COMPONENT UPDATED, UPDATE URL
    componentDidUpdate(prevProps, prevState) {
      if (this.state.append !== prevState.append)
      {this.props.setSearchParams({
        node_id: this.state.node_id,
        kind: this.state.selectedOption
      })}
    };

    //RENDER ///////////////////////////////////////////////////////////////////////
    render() {
        return (
            <div className="bg-light" style={{ height: '100vh' }}>
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
        <FilterDataDash
          {...this.state}
          selectSwitchInitial={this.selectSwitchInitial}
          handleChange={this.handleChange}
          handleOptionChange={this.handleOptionChange}
          handleInputChange={this.handleInputChange }
          handleCheck={this.handleCheck}
          resetFilter={this.resetFilter}
          clearFilters={this.clearFilters}
          fetchNetworkResults={this.fetchNetworkResults}
          filterHide={this.filterHide}
          fetchNetworkIndexes={this.fetchNetworkIndexes}
          handleChangeData={this.handleChangeData}
          handleChangeDataDD={this.handleChangeDataDD}
          fetchCorporateEntitiesData={this.fetchCorporateEntitiesData}
          fetchInstitutionsData={this.fetchInstitutionsData}
          fetchGeographyData={this.fetchGeographyData}
          fetchDBWide={this.fetchDBWide}
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

        <DataResults
          {...this.state}
          handleChange={this.handleChange}
          breadCrumbChainer={this.breadCrumbChainer}
          selectSwitchInitial={this.selectSwitchInitial}
          linkCheck={this.linkCheck}
          getCitation={this.getCitation}
        />

            </div>
        );
    }
}

export default withRouter(DataView);
