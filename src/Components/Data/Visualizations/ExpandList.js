// Imports
import { Card, Tab, Tabs, Table} from 'react-bootstrap/'
import React, { useEffect, useState, useRef } from "react";
import { TableBody } from 'semantic-ui-react';
import { max } from 'd3';

const tableBody = document.getElementById("tableBody");

// Function

function ExpandableList (props) {
    
    // Display the table.
    return (
        <Card style={{ width: '47%', border: 'none', marginBottom: '10%'}}>
            <Card.Body style={{ alignSelf: 'center', width: '100%'}}>
                <Card.Title className="fs-6 mb-4 mt-2 text-center fw-normal" style={{ alignSelf: 'center'}}>{props.title}</Card.Title>
                    <Tabs defaultActiveKey="provinces" id="uncontrolled-tab-example" className="mb-3">
                        <Tab eventKey="provinces" title="Provinces">
                            <Table bordered hover>
                                <tbody id="tableBody">
                                    {
                                        Array.from(props.queryResult[0]).map((item) => {    
                                        return[
                                            <tr>
                                                <td>{item.Province}</td>
                                                <td>{item.Activity}</td>
                                            </tr>
                                        ] 
                                    })}
                                </tbody>
                            </Table>
                        </Tab>
                        <Tab eventKey="prefectures" title="Prefectures">
                            <Table bordered hover>
                                <tbody id="tableBody">
                                    {
                                        Array.from(props.queryResult[1]).map((item) => {    
                                        return[
                                            <tr>
                                                <td>{item.Prefecture}</td>
                                                <td>{item.Activity}</td>
                                            </tr>
                                        ] 
                                    })}
                                </tbody>
                            </Table>
                        </Tab>
                        <Tab eventKey="counties" title="Counties">
                            <Table bordered hover>
                                <tbody id="tableBody">
                                    {
                                        Array.from(props.queryResult[2]).map((item) => {    
                                        return[
                                            <tr>
                                                <td>{item.County}</td>
                                                <td>{item.Activity}</td>
                                            </tr>
                                        ] 
                                    })}
                                </tbody>
                            </Table>
                        </Tab>
                    </Tabs>
            </Card.Body>
        </Card>
    )
}

export default ExpandableList