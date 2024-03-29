// Imports
import { Card, Tab, Table, Nav, Spinner} from 'react-bootstrap/'
import React from "react";
import translate from "../../../Assets/indexes/translate.json"

const tableBody = document.getElementById("tableBody");

// Function

function ExpandableList (props) {
    if (props.language == "zh" || props.language == "tw" ) {
    // Display the table.
    return (
        <Card className="h-100 w-100">
            <Card.Body>
                <Card.Title className="fs-6 mb-4 mt-4 text-center fw-normal">{props.title}</Card.Title>
                <Tab.Container defaultActiveKey="provinces">
                    <Nav variant="pills" className="mb-3 justify-content-center">
                        <Nav.Item className="m-1 h-50 border border-1 border-danger rounded ">
                            <Nav.Link eventKey="provinces">{translate[0]["province"][props.language]}</Nav.Link>
                        </Nav.Item >
                        <Nav.Item className="m-1 h-50 border border-1 border-danger rounded ">
                            <Nav.Link eventKey="prefectures" id="test">{translate[0]["prefecture"][props.language]}</Nav.Link>
                        </Nav.Item>
                        <Nav.Item className="m-1 h-50 border border-1 border-danger rounded ">
                            <Nav.Link eventKey="counties" id="test">{translate[0]["county"][props.language]}</Nav.Link>
                        </Nav.Item>
                    </Nav>
                    <Tab.Content>
                        <Tab.Pane eventKey="provinces" style={{minWidth: '400px'}}>
                        { props.queryResult
                        ? <Table bordered hover className="table-responsive-sm mb-0 small">
                              <thead>
                                <tr>
                                  <th>{translate[0]["province"][props.language]}</th>
                                  <th>{translate[0]["location_record_count"][props.language]}</th>
                                </tr>
                              </thead>
                              <tbody id="tableBody">
                                  {Array.from(props.queryResult[0]).map((item) => { return[
                                      <tr className="p-0">
                                        <td className="p-1">{item.Province.zh}</td>
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
                                  <th>{translate[0]["prefecture"][props.language]}</th>
                                  <th>{translate[0]["location_record_count"][props.language]}</th>
                                </tr>
                              </thead>
                              <tbody id="tableBody">
                                  {
                                      Array.from(props.queryResult[1]).map((item) => {
                                      return[
                                          <tr>
                                              <td className="p-1">{item.Prefecture.zh}</td>
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
                                  <th>{translate[0]["county"][props.language]}</th>
                                  <th>{translate[0]["location_record_count"][props.language]}</th>
                                </tr>
                              </thead>
                              <tbody id="tableBody">
                                  {
                                      Array.from(props.queryResult[2]).map((item) => {
                                        return [
                                            <tr>
                                                <td className="p-1">{item.County.zh}</td>
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
    )}
    else {
        // Display the table.
        return (
            <Card className="h-100 w-100">
                <Card.Body>
                    <Card.Title className="fs-6 mb-4 mt-4 text-center fw-normal">{props.title}</Card.Title>
                    <Tab.Container defaultActiveKey="provinces">
                        <Nav variant="pills" className="mb-3 justify-content-center">
                            <Nav.Item className="m-1 h-50 border border-1 border-danger rounded ">
                                <Nav.Link eventKey="provinces">{translate[0]["province"][props.language]}</Nav.Link>
                            </Nav.Item >
                            <Nav.Item className="m-1 h-50 border border-1 border-danger rounded ">
                                <Nav.Link eventKey="prefectures" id="test">{translate[0]["prefecture"][props.language]}</Nav.Link>
                            </Nav.Item>
                            <Nav.Item className="m-1 h-50 border border-1 border-danger rounded ">
                                <Nav.Link eventKey="counties" id="test">{translate[0]["county"][props.language]}</Nav.Link>
                            </Nav.Item>
                        </Nav>
                        <Tab.Content>
                            <Tab.Pane eventKey="provinces" style={{minWidth: '400px'}}>
                            { props.queryResult
                            ? <Table bordered hover className="table-responsive-sm mb-0 small">
                                <thead>
                                    <tr>
                                    <th>{translate[0]["province"][props.language]}</th>
                                    <th>{translate[0]["location_record_count"][props.language]}</th>
                                    </tr>
                                </thead>
                                <tbody id="tableBody">
                                    {Array.from(props.queryResult[0]).map((item) => { return[
                                        <tr className="p-0">
                                            <td className="p-1">{item.Province.en}</td>
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
                                    <th>{translate[0]["prefecture"][props.language]}</th>
                                    <th>{translate[0]["location_record_count"][props.language]}</th>
                                    </tr>
                                </thead>
                                <tbody id="tableBody">
                                    {
                                        Array.from(props.queryResult[1]).map((item) => {
                                        return[
                                            <tr>
                                                <td className="p-1">{item.Prefecture.en}</td>
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
                                    <th>{translate[0]["county"][props.language]}</th>
                                    <th>{translate[0]["location_record_count"][props.language]}</th>
                                    </tr>
                                </thead>
                                <tbody id="tableBody">
                                    {
                                        Array.from(props.queryResult[2]).map((item) => {
                                            return [
                                                <tr>
                                                    <td className="p-1">{item.County.en}</td>
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
}

export default ExpandableList
