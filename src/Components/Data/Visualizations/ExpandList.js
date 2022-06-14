// Imports
import { Card, Tab, Tabs, Table, Nav} from 'react-bootstrap/'
import React, { useEffect, useState, useRef } from "react";
import { TableBody } from 'semantic-ui-react';
import { max } from 'd3';

const tableBody = document.getElementById("tableBody");

// Function

function ExpandableList (props) {

    // Display the table.
    return (
        <Card className="w-100">
            <Card.Body>
                <Card.Title className="fs-6 mb-4 mt-2 text-center fw-normal">{props.title}</Card.Title>
                <Tab.Container defaultActiveKey="provinces">
                    <Nav variant="pills" className="mb-1">
                        <Nav.Item className="m-1 h-50 border border-1 border-danger rounded ">
                            <Nav.Link eventKey="provinces">Provinces</Nav.Link>
                        </Nav.Item >
                        <Nav.Item className="m-1 h-50 border border-1 border-danger rounded ">
                            <Nav.Link eventKey="prefectures" id="test">Prefectures</Nav.Link>
                        </Nav.Item>
                        <Nav.Item className="m-1 h-50 border border-1 border-danger rounded ">
                            <Nav.Link eventKey="counties" id="test">Counties</Nav.Link>
                        </Nav.Item>
                    </Nav>
                    <Tab.Content>
                        <Tab.Pane eventKey="provinces">
                          <Table bordered hover className="table-responsive-sm mb-0">
                              <thead>
                                <tr>
                                  <th>Province</th>
                                  <th>Location Record Count</th>
                                </tr>
                              </thead>
                              <tbody id="tableBody">
                                  {Array.from(props.queryResult[0]).map((item) => { return[
                                      <tr className="p-0">
                                        <td>{item.Province}</td>
                                        <td>{item.Activity}</td>
                                      </tr>
                                    ]})}
                              </tbody>
                          </Table>
                        </Tab.Pane>
                        <Tab.Pane eventKey="prefectures">
                          <Table bordered hover className="table-responsive-sm mb-0">
                              <thead>
                                <tr>
                                  <th>Prefecture</th>
                                  <th>Location Record Count</th>
                                </tr>
                              </thead>
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
                        </Tab.Pane>
                        <Tab.Pane eventKey="counties">
                          <Table bordered hover className="table-responsive-sm mb-0">
                              <thead>
                                <tr>
                                  <th>County</th>
                                  <th>Location Record Count</th>
                                </tr>
                              </thead>
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
                        </Tab.Pane>
                    </Tab.Content>
                </Tab.Container>
            </Card.Body>
        </Card>
    )
}

export default ExpandableList
