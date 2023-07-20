// Imports
import { Card, Tab, Table, Nav, Spinner} from 'react-bootstrap/'
import React from "react";

const tableBody = document.getElementById("tableBody");

// Function

function ExpandableList (props) {

    // Display the table.
    return (
        <Card className="h-100 w-100">
            <Card.Body>
                <Card.Title className="fs-6 mb-4 mt-4 text-center fw-normal">{props.title}</Card.Title>
                <Tab.Container defaultActiveKey="provinces">
                    <Nav variant="pills" className="mb-3 justify-content-center">
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
                        <Tab.Pane eventKey="provinces" style={{minWidth: '400px'}}>
                        { props.queryResult
                        ? <Table bordered hover className="table-responsive-sm mb-0 small">
                              <thead>
                                <tr>
                                  <th>Province</th>
                                  <th>Location Record Count</th>
                                </tr>
                              </thead>
                              <tbody id="tableBody">
                                  {Array.from(props.queryResult[0]).map((item) => { return[
                                      <tr className="p-0">
                                        <td className="p-1">{item.Province}</td>
                                        <td className="p-1">{item.Activity}</td>
                                      </tr>
                                    ]})}
                              </tbody>
                          </Table>
                          : <Spinner animation="border" role="status" variant="danger"><span className="visually-hidden">Loading...</span></Spinner>
                        }
                        </Tab.Pane>
                        <Tab.Pane eventKey="prefectures" style={{minWidth: '400px'}}>
                        { props.queryResult
                        ? <Table bordered hover className="table-responsive-sm mb-0 small">
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
                                              <td className="p-1">{item.Prefecture}</td>
                                              <td className="p-1">{item.Activity}</td>
                                          </tr>
                                      ]
                                  })}
                              </tbody>
                          </Table>
                          : <Spinner animation="border" role="status" variant="danger"><span className="visually-hidden">Loading...</span></Spinner>
                        }
                        </Tab.Pane>
                        <Tab.Pane eventKey="counties" style={{minWidth: '400px'}}>
                        { props.queryResult
                        ? <Table bordered hover className="table-responsive-sm mb-0 small">
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
                                              <td className="p-1">{item.County}</td>
                                              <td className="p-1">{item.Activity}</td>
                                          </tr>
                                      ]
                                  })}
                              </tbody>
                          </Table>
                          : <Spinner animation="border" role="status" variant="danger"><span className="visually-hidden">Loading...</span></Spinner>
                        }
                        </Tab.Pane>
                    </Tab.Content>
                </Tab.Container>
            </Card.Body>
        </Card>
    )
}

export default ExpandableList
