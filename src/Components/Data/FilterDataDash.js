/////////////////////////////////////////////////////////////////////////////////////////////////////
// IMPORTS //////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

import React from 'react'
import { Row, Col, Form, Button, Nav, Tab, Tabs, Card, Spinner } from 'react-bootstrap'
import Select from 'react-select'
import ReactTooltip from "react-tooltip"
import translate from "../../Assets/indexes/translate.json"
import { BsFilterLeft } from 'react-icons/bs'



/////////////////////////////////////////////////////////////////////////////////////////////////////
// COMPONENT ////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

function FilterDataDash(props) {

// SELECT ALL FILTER //////////////////////////////////////////////////////////////////////////////////////////
function allFilters(props) {
  if (props.nodeArray.length !== 0) {
  return (
    <Row className="d-flex justify-content-end">
      <Col>
        <div classname="filter-buttons">
          <Row className="mb-1 mt-4">
            <Col className="d-flex justify-content-end">
              <Button style={{fontSize: '1em'}} className="h-100 mb-1 col-xs-12 col-sm-12 col-md-6 col-lg-6" variant="danger" onClick={() =>  props.fetchDBWide()}>{translate[0]["submit"][props.language]}</Button>
            </Col>
          </Row>
        </div>
      </Col>
    </Row>
  )} else {}
};

// SELECT CORP FILTER //////////////////////////////////////////////////////////////////////////////////////////
function corpFilters(props) {
  return (
    <Row className="d-flex justify-content-end">
      <Col className="col-12 col-sm-12 col-md-6 col-lg-6">
        <Form><Form.Group className="mb-1">
          <Row><Col>
            <ReactTooltip id="inst_category" place="right" effect="solid">{translate[0]["select_start"][props.language]} {translate[0]["category"][props.language]}</ReactTooltip>
            <Select 
              key={props.append}
              options={props.corpOptions} 
              placeholder={translate[0]["select"][props.language]}
              getOptionLabel={option => {
                if (option.label_alt !== null & props.language !== 'en') {return option.label_alt}
                else {return option.label}
              }}
              onInputChange={props.handleInputChange} 
              onChange={(option) =>  props.handleChangeDataDD(option)}
            />
          </Col></Row>
        </Form.Group></Form>
      </Col>
      <Col className="col-12 col-sm-12 col-md-6 col-lg-6">
        <div classname="filter-buttons">
          <Row className="mb-1">
            <Col>
              <Button style={{fontSize: '1em'}} className="mb-1 col-12" variant="danger" onClick={() =>  props.fetchCorporateEntitiesData()}>{translate[0]["submit"][props.language]}</Button>
            </Col>
            <Col>
              <Button style={{fontSize: '1em'}} className="mb-1 col-12" variant="outline-danger" onClick={() => window.location.reload(false)}>{translate[0]["reset"][props.language]}</Button>
            </Col>
          </Row>
        </div>
      </Col>
    </Row>
  )};

// SELECT INST FILTER //////////////////////////////////////////////////////////////////////////////////////////
function instFilters(props) {
  return (
    <Row className="d-flex justify-content-end">
      <Col className="col-12 col-sm-12 col-md-6 col-lg-6">
        <Form><Form.Group className="mb-1">
          <Row><Col>
            <ReactTooltip id="inst_category" place="right" effect="solid">{translate[0]["select_start"][props.language]} {translate[0]["category"][props.language]}</ReactTooltip>
            <Select 
              key={props.append}
              options={props.instOptions} 
              placeholder={translate[0]["select"][props.language]}
              getOptionLabel={option => {
                if (option.label_alt !== null & props.language !== 'en') {return option.label_alt}
                else {return option.label}
              }}
              onInputChange={props.handleInputChange} 
              onChange={(option) =>  props.handleChangeDataDD(option)}
            />
          </Col></Row>
        </Form.Group></Form>
      </Col>
      <Col className="col-12 col-sm-12 col-md-6 col-lg-6">
        <div classname="filter-buttons">
          <Row className="mb-1">
            <Col>
              <Button style={{fontSize: '1em'}} className="mb-1 col-12" variant="danger" onClick={() =>  props.fetchInstitutionsData()}>{translate[0]["submit"][props.language]}</Button>
            </Col>
            <Col>
              <Button style={{fontSize: '1em'}}className="mb-1 col-12" variant="outline-danger" onClick={() => window.location.reload(false)}>{translate[0]["reset"][props.language]}</Button>
            </Col>
          </Row>
        </div>
      </Col>
    </Row>
  )};
// SELECT GEO FILTER //////////////////////////////////////////////////////////////////////////////////////////
function geoFilters(props) {
  return (
    <Row className="d-flex justify-content-end">
      <Col className="col-12 col-sm-12 col-md-6 col-lg-6">
        <Form><Form.Group className="mb-1">
          <Row><Col>
            <ReactTooltip id="inst_category" place="right" effect="solid">{translate[0]["select_start"][props.language]} {translate[0]["category"][props.language]}</ReactTooltip>
            <Select 
              key={props.append}
              options={props.geoOptions} 
              placeholder={translate[0]["select"][props.language]}
              getOptionLabel={option => {
                if (option.label_alt !== null & props.language !== 'en') {return option.label_alt}
                else {return option.label}
              }}
              onInputChange={props.handleInputChange} 
              onChange={(option) =>  props.handleChangeDataDD(option)}
            />
          </Col></Row>
        </Form.Group></Form>
      </Col>
      <Col className="col-12 col-sm-12 col-md-6 col-lg-6">
        <div classname="filter-buttons">
          <Row className="mb-1">
            <Col>
              <Button style={{fontSize: '1em'}} className="mb-1 col-12" variant="danger" onClick={() =>  props.fetchGeographyData()}>{translate[0]["submit"][props.language]}</Button>
            </Col>
            <Col>
              <Button style={{fontSize: '1em'}} className="mb-1 col-12" variant="outline-danger" onClick={() => window.location.reload(false)}>{translate[0]["reset"][props.language]}</Button>
            </Col>
          </Row>
        </div>
      </Col>
    </Row>
  )};

// BUTTON STYLING ON CORP FETCH ////////////////////////////////////////////////////////////////////////////////
function corpDataCheck(props) {
  if (props.corpOptions.length >= 1) {
    return (
      <Nav.Item className="m-1 h-50 border border-1 border-danger rounded col-5 col-sm-5 col-md-5 col-lg">
        <Nav.Link eventKey="Organizations">{translate[0]["organizations"][props.language]}</Nav.Link></Nav.Item>
      )
  } else {
    return (
      <Nav.Item className="m-1 h-50 border border-1 border-muted rounded ml-2 pe-none col-5 col-sm-5 col-md-5 col-lg">
        <span className="text-muted d-inline-block float-left py-2 pe-1 ps-2">{translate[0]["organizations"][props.language]}</span>
        <Spinner className="me-2" animation="border" role="status" variant="muted" size="sm" ></Spinner>
      </Nav.Item>
    )
  }
};

// BUTTON STYLING ON INST FETCH ///////////////////////////////////////////////////////////////////////////////
function instDataCheck(props) {
  if (props.instOptions.length >= 1) {
    return (
      <Nav.Item className="m-1 h-50 border border-1 border-danger rounded col-5 col-sm-5 col-md-5 col-lg">
        <Nav.Link eventKey="Institutions">{translate[0]["institutions"][props.language]}</Nav.Link></Nav.Item>
      )
  } else {
    return (
      <Nav.Item className="m-1 h-50 border border-1 border-muted rounded ml-2 pe-none col-5 col-sm-5 col-md-5 col-lg">
        <span className="text-muted d-inline-block float-left py-2 pe-1 ps-2">{translate[0]["institutions"][props.language]}</span>
        <Spinner className="me-2" animation="border" role="status" variant="muted" size="sm" ></Spinner>
      </Nav.Item>
    )
  }
};

// BUTTON STYLING ON GEO FETCH /////////////////////////////////////////////////////////////////////////////////
function geoDataCheck(props) {
  if (props.geoOptions.length >= 1) {
    return (
      <Nav.Item className="m-1 h-50 border border-1 border-danger rounded col-5 col-sm-5 col-md-5 col-lg">
        <Nav.Link eventKey="Geography">{translate[0]["geography"][props.language]}</Nav.Link></Nav.Item>
      )
  } else {
    return (
      <Nav.Item className="m-1 h-50 border border-1 border-muted rounded ml-2 pe-none col-5 col-sm-5 col-md-5 col-lg">
        <span className="text-muted d-inline-block float-left py-2 pe-1 ps-2">{translate[0]["geography"][props.language]}</span>
        <Spinner className="me-2" animation="border" role="status" variant="muted" size="sm" ></Spinner>
      </Nav.Item>
    )
  }
};
//// RETURN ///////////////////////////////////////////////////////////////////////////
//// RETURN ///////////////////////////////////////////////////////////////////////////
//// RETURN ///////////////////////////////////////////////////////////////////////////

 return (
  <div className="">
      <div className={props.filterDisplay + " px-3 py-0 bg-light"}>
      <Card className="h-100 py-2 px-3 justify-content-center overflow-visible filter_container_top rounded-0 rounded-bottom">
      <Card.Body className="m-0 p-0">
          <Tab.Container defaultActiveKey="All">
            <Row className="w-100">
              <Col className="col-8">
              <Row><Col><Form.Label className="filter_label mb-0" data-tip data-for="node">{translate[0]["data_category"][props.language]}</Form.Label></Col></Row>
              <Nav variant="pills" className="mb-2" style={{fontSize: '.75em'}}>
                  <Nav.Item className="m-1 h-50 border border-1 border-danger rounded col-5 col-sm-5 col-md-5 col-lg"><Nav.Link eventKey="All">{translate[0]["all"][props.language]}</Nav.Link></Nav.Item >
                  {corpDataCheck(props)}
                  {instDataCheck(props)}
                  {geoDataCheck(props)}
                
              </Nav>
              </Col>
              <Col>
              <Tab.Content>
                  <Tab.Pane eventKey="All">
                    <Row className="d-flex justify-content-end" style={{fontSize: '.75em'}}>
                          {allFilters(props)}
                    </Row>
                  </Tab.Pane>
                  <Tab.Pane eventKey="Organizations">
                    <Row className="d-flex justify-content-end" style={{fontSize: '.75em'}}>
                      <Row><Col><Form.Label className="filter_label mt-2 mb-1 " data-tip data-for="node">{translate[0]["option_select"][props.language]}</Form.Label></Col></Row>
                          {corpFilters(props)}
                    </Row>
                  </Tab.Pane>
                  <Tab.Pane eventKey="Institutions">
                    <Row className="d-flex justify-content-end" style={{fontSize: '.75em'}}>
                      <Row><Col><Form.Label className="filter_label mt-2 mb-1 " data-tip data-for="node">{translate[0]["option_select"][props.language]}</Form.Label></Col></Row>
                        {instFilters(props)}
                    </Row>
                  </Tab.Pane>
                  <Tab.Pane eventKey="Geography">
                    <Row className="d-flex justify-content-end" style={{fontSize: '.75em'}}>
                      <Row><Col><Form.Label className="filter_label mt-2 mb-1 " data-tip data-for="node">{translate[0]["option_select"][props.language]}</Form.Label></Col></Row>
                        {geoFilters(props)}
                    </Row>
                  </Tab.Pane>
              </Tab.Content>
              </Col>
            </Row>
          </Tab.Container>
      </Card.Body>
    </Card>
    </div>
    <div style={{position: 'relative'}}>
    <div onClick={() =>  props.filterHide()} 
      className="filter_button_data" 
      data-tip data-for="toggle">
      <ReactTooltip id="toggle" place="bottom" effect="solid">{translate[0]["toggle_filters"][props.language]}</ReactTooltip>
      <BsFilterLeft />
    </div>
    </div>
</div>
 )
}

/////////////////////////////////////////////////////////////////////////////////////////////////////
// EXPORT //////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

export default FilterDataDash
