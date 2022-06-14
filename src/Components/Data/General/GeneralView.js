// IMPORTS ////////////////////////////////////////////////////////////////////
import TotalCount from "../Visualizations/TotalCount";
import PieChart from "../Visualizations/PieChart";
import ExpandList from "../Visualizations/ExpandList"
import SwitchablePieChart from "../Visualizations/SwitchablePieChart";
import { Row, Col, Card, Container } from 'react-bootstrap';
import Citation from "../../Popups/Citation.js";
import BarGraph from "../Visualizations/BarGraph";
import Navbar from "../../Navbar/Navbar.js";
import NavigationDataViews from "../NavigationDataViews";

// MAIN DEPENDENCIES
import React, { Component } from "react";
import neo4j from "neo4j-driver/lib/browser/neo4j-web";
// HELPER FILES
import credentials from "../../../credentials.json";
import * as query from "../../Utils/Queries.js";
import * as helper from "../../Utils/Helpers.js";

class GeneralView extends Component {
    //STATE, PROPS, DRIVER INFO, & BINDS
    constructor(props) {
        super(props);
        this.state = {
            language: "en",
            cite: "cite hide",
            // QUERIES
            totalPeople: "",
            totalRelationships: "",
            totalInstitutions: "",
            totalEvents: "",
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
            christianTraditionNullValues: ""
        };

        // INITIATE NEO4J INSTANCE
        this.driver = neo4j.driver(credentials.port, neo4j.auth.basic(credentials.username, credentials.password), {
            disableLosslessIntegers: true
        });
        // BIND UTILITY FUNCTIONS TO THIS CONTEXT
        this.langSwitch = helper.langSwitch.bind(this);
        this.selectSwitchInitial = query.selectSwitchInitial.bind(this);

        // QUERIES
        this.fetchTotalPeople = query.fetchTotalPeople.bind(this);
        this.fetchTotalRelationship = query.fetchTotalRelationship.bind(this);
        this.fetchTotalInstitutions = query.fetchTotalInstitutions.bind(this);
        this.fetchTotalEvents = query.fetchTotalEvents.bind(this);
        this.fetchTotalNodes = query.fetchTotalNodes.bind(this);
        this.fetchTotalCorporateEntities = query.fetchTotalCorporateEntities.bind(this);
        this.fetchGenders = query.fetchGenders.bind(this);
        this.fetchChristianTradition = query.fetchChristianTradition.bind(this);
        this.fetchReligiousFamily = query.fetchReligiousFamily.bind(this);
        this.fetchReligiousFamilyNullValues = query.fetchReligiousFamilyNullValues.bind(this);
        this.fetchChristianTraditionNullValues = query.fetchChristianTraditionNullValues.bind(this);
        this.renameProperty = helper.renameProperty.bind(this);
        this.fetchProvinces = query.fetchProvinces.bind(this);
        this.fetchPrefectures = query.fetchPrefectures.bind(this);
        this.fetchCounties = query.fetchCounties.bind(this);
        this.fetchNationality = query.fetchNationality.bind(this);
        this.fetchNationalityNull = query.fetchNationalityNull.bind(this);
        this.toggleDisplay = helper.toggleDisplay.bind(this);
        this.toggleCite = helper.toggleCite.bind(this);
    }

    //RUN ON COMPONENT MOUNT //////////////////////////////////////////////////////
    componentDidMount() {
        this.fetchTotalPeople();
        this.fetchTotalRelationship();
        this.fetchTotalEvents();
        this.fetchTotalInstitutions();
        this.fetchTotalNodes();
        this.fetchTotalCorporateEntities();
        this.fetchGenders();
        this.fetchProvinces();
        this.fetchPrefectures();
        this.fetchCounties();
        this.fetchNationality();
        this.fetchNationalityNull();
        this.fetchChristianTradition();
        this.fetchReligiousFamily();
        this.fetchReligiousFamilyNullValues();
        this.fetchChristianTraditionNullValues();
    }

    sanitizeList(list, property1,) {
        // Loop through each list object and sanitize for d3 processing (d3 PieChart.js requires 'key' and 'value' object pairs)
        for (let i = 0; i < list.length; i++) {
            this.renameProperty(list[i], property1, 'key')
            this.renameProperty(list[i], 'count', 'value')
        }
    }

    //RENDER ///////////////////////////////////////////////////////////////////////
    render() {
        return (
            <div className="bg-light">
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
                <NavigationDataViews />

                <div>

                <Container>

                  <Row className="d-flex flex-wrap flex-row justify-content-center mb-3">
                    <Col>
                    {/* Total Counts ////////////////////////////////////////////////////////*/}
                    <div className="d-flex flex-wrap flex-row justify-content-center">
                        <TotalCount type="Nodes" queryResult={this.state.totalNodes} />
                        <TotalCount type="Relationships" queryResult={this.state.totalRelationships} />
                        <TotalCount type="People" queryResult={this.state.totalPeople} />
                        <TotalCount type="Institutions" queryResult={this.state.totalInstitutions} />
                        <TotalCount type="Events" queryResult={this.state.totalEvents} />
                        <TotalCount type="Corporate Entities" queryResult={this.state.totalCorporateEntities} />
                    </div>
                    </Col>
                  </Row>

                  <Row className="d-flex flex-wrap flex-row justify-content-center mb-3">
                    <Col className="mb-3">
                    {/* Gender Counts ////////////////////////////////////////////////////////*/}
                    <div className="h-100">
                        { this.state.genders && (
                            this.sanitizeList(this.state.genders, 'gender'),
                            <PieChart title="All People by Gender" queryResult={this.state.genders} />
                        )}
                    </div>
                    </Col>
                    <Col className="mb-3">
                    <div className="h-100">
                        { (this.state.christianTradition && this.state.religiousFamily) && (
                            this.sanitizeList(this.state.christianTradition, 'christian_tradition'),
                            this.sanitizeList(this.state.religiousFamily, 'religious_family'),
                            <SwitchablePieChart
                                title1="Total Nodes by Religious Family"
                                title2="Total Nodes by Christian Traditions"
                                queryResult1={this.state.religiousFamily}
                                queryResult1NullValues={this.state.religiousFamilyNullValues}
                                queryResult2={this.state.christianTradition}
                                queryResult2NullValues={this.state.christianTraditionNullValues} />
                        )}
                    </div>
                    </Col>
                  </Row>
                  <Row className="d-flex flex-wrap flex-row justify-content-center mb-3">
                    <Col className="mb-3">
                    <div className="h-100 d-flex justify-content-center">
                        { this.state.nationality && (
                            <BarGraph title="All People by Nationalities with More than Ten People"
                            queryResult={this.state.nationality}
                            queryResultNationalityNull={this.state.nationalityNull}
                            />
                        )}
                    </div>
                    </Col>
                    <Col className="mb-3">
                    <div className="d-flex justify-content-center">
                      { this.state.provinces && (
                        <ExpandList title="Highest Areas of Activity by Modern Adminstrative Division"
                        queryResult={[this.state.provinces, this.state.prefectures, this.state.counties]}
                        />
                      )}
                    </div>
                    </Col>

                  </Row>

                </Container>

                </div>
            </div>
        );
    }
}

export default GeneralView;
