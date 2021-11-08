// IMPORTS ////////////////////////////////////////////////////////////////////
import GeneralView from './General/GeneralView';

// MAIN DEPENDENCIES
import React from 'react'
import { Row, Col, Spinner, Tab, Nav, TabContainer} from 'react-bootstrap';



// FUNCTIONAL COMPONENT ////////////////////////////////////////////////////////

function DataCharts(props) {

  // RETURNS PLACEHOLDER
  return (
    <div className="list_container bg-white">
      <div className="list_float">
        <Row><Col>
          <div className="pt-4">
            <TabContainer defaultActiveKey="general-view" transition={false}>
              <Nav variant="pills" className="d-flex justify-content-center">
                <Nav.Item>
                  <Nav.Link eventKey="general-view">General View</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="corporate-entity-view">Corporate Entity View</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="institution-view">Institution View</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="geographic-view">Geographic View</Nav.Link>
                </Nav.Item>
              </Nav>
              <Tab.Content>
                <Tab.Pane eventKey="general-view">
                  <GeneralView />
                </Tab.Pane>
                <Tab.Pane eventKey="corporate-entity-view">
                  Corporate entity data
                </Tab.Pane>
                <Tab.Pane eventKey="institution-view">
                  Institution data
                </Tab.Pane>
                <Tab.Pane eventKey="geographic-view">
                  Geogprahic data
                </Tab.Pane>
              </Tab.Content>
            </TabContainer>
          </div>
        </Col></Row>
      </div>
    </div>
  )

}

export default DataCharts
