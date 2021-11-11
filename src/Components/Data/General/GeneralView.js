// IMPORTS ////////////////////////////////////////////////////////////////////
import TotalCount from "./TotalCount";
import TotalNode from "./TotalNode";
import TotalRelationship from "./TotalRelationship";

// MAIN DEPENDENCIES
import React, { Component } from "react";
import neo4j from "neo4j-driver/lib/browser/neo4j-web";
// HELPER FILES
import credentials from "../../../credentials.json";
import * as helper from "../../Utils/Helpers.js";
import * as query from "../../Utils/Queries.js";

class GeneralView extends Component {
    //STATE, PROPS, DRIVER INFO, & BINDS
    constructor(props) {
        super(props);
        this.state = {
            totalPeople: "",
            totalRelationships: ""
        };

        // INITIATE NEO4J INSTANCE
        this.driver = neo4j.driver(credentials.port, neo4j.auth.basic(credentials.username, credentials.password), {
            disableLosslessIntegers: true
        });
        // BIND UTILITY FUNCTIONS TO THIS CONTEXT
        this.fetchTotalPeople = query.fetchTotalPeople.bind(this);
        this.fetchTotalNode = query.fetchTotalNode.bind(this);
        this.fetchTotalRelationship = query.fetchTotalRelationship.bind(this);
    }

    //RUN ON COMPONENT MOUNT //////////////////////////////////////////////////////
    componentDidMount() {
        this.fetchTotalPeople();
        this.fetchTotalNode();
        this.fetchTotalRelationship();
    }

    //RENDER ///////////////////////////////////////////////////////////////////////
    render() {
        return (
            <>
                <div className="d-flex">
                    <TotalCount type="Nodes" queryResult={this.state.totalNode} /* PUT YOUR CUSTOM QUERY HERE */ />
                    <TotalCount type="Relationships" queryResult={this.state.totalRelationship} />
                    <TotalCount type="People" queryResult={this.state.totalPeople} />
                </div>
            </>
        );
    }
}

export default GeneralView;
