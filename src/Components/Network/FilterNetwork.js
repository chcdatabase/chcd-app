/////////////////////////////////////////////////////////////////////////////////////////////////////
// IMPORTS //////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

import React from 'react'
import { Row, Col, Form, Button } from 'react-bootstrap'
import { BsFilterLeft } from 'react-icons/bs'
import AsyncSelect from 'react-select/async';
import ReactTooltip from "react-tooltip"
import translate from "../../Assets/indexes/translate.json"


/////////////////////////////////////////////////////////////////////////////////////////////////////
// COMPONENT ////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

function FilterNetwork(props) {


//NODE OPTIONS CALLBACK
const loadOptions = ( inputValue: string, callback: (options: props.netPersonIndex) => void) => {
  setTimeout(() => {callback(props.fetchNetworkIndexes(inputValue));}, 500);
};


// SELECT TYPE FILTER //////////////////////////////////////////////////////////////////////////////////////////
function typeFilter(props) {
  return (
    <Form.Group className="mb-1"><Row><Col>
        <Row><Col><Form.Label className="filter_label mb-0" data-tip data-for="node">{translate[0]["central_node_type"][props.language]}</Form.Label></Col></Row>
           <ReactTooltip id="node" place="right" effect="solid">{translate[0]["type_to_select"][props.language]}</ReactTooltip>
        <Row>
          <Col>
          <div className="form-check">
            <label> <input type="radio" className="form-check-input" onChange={props.handleOptionChange} value="Person" checked={props.selectedOption === "Person"} />{translate[0]["person"][props.language]}</label>
          </div>
          <div className="form-check">
            <label> <input type="radio" className="form-check-input" onChange={props.handleOptionChange} value="Institution" checked={props.selectedOption === "Institution"} />{translate[0]["institution"][props.language]}</label>
          </div>
          <div className="form-check">
            <label> <input type="radio" className="form-check-input" onChange={props.handleOptionChange} value="CorporateEntity" checked={props.selectedOption === "CorporateEntity"} />{translate[0]["corporate_entity"][props.language]}</label>
          </div>
          <div className="form-check">
            <label> <input type="radio" className="form-check-input" onChange={props.handleOptionChange} value="Event" checked={props.selectedOption === "Event"} />{translate[0]["event"][props.language]}</label>
          </div>
          </Col>
        </Row>
    </Col></Row></Form.Group>
  )
};

// SELECT NODE FILTER //////////////////////////////////////////////////////////////////////////////////////////
function nodeFilters(props) {
  if (props.selectedOption !== "") {return (
    <Form.Group className="mb-1"><Row><Col>
        <Row><Col><Form.Label className="filter_label mb-0" data-tip data-for="node">{translate[0]["node"][props.language]}</Form.Label></Col></Row>
           <ReactTooltip id="node" place="right" effect="solid">{translate[0]["type_to_select"][props.language]}</ReactTooltip>
        <Row><Col>
          <AsyncSelect
            loadOptions={loadOptions}
            onInputChange={props.handleInputChange}
            placeholder={translate[0]["select"][props.language]}
            defaultInputValue={props.inputValue}
            onChange={(option) =>  props.handleChangeData(option)}
          />
        </Col></Row>
    </Col></Row></Form.Group>
    )
  } else {return null}
};

// TIME FILTERs ////////////////////////////////////////////////////////////////////////////////////////////////
function timeFilters(props) {
if (props.selectedOption !== "") {return (
    <Row className="mb-1">
    <Col>
      <Form.Group>
        <Row><Col>
            <Form.Label className="filter_label mb-0" data-tip data-for="start_year">{translate[0]["start_year"][props.language]}</Form.Label>
               <ReactTooltip id="start_year" place="right" effect="solid">{translate[0]["enter_year"][props.language]}</ReactTooltip>
            <Form.Control
              type="text"
              name="start_year"
              aria-label={translate[0]["start_year"][props.language]}
              value={props.start_year}
              onChange={(i) =>  props.handleChange(i)}
              disabled={props.time_disable}
            />
        </Col></Row>
      </Form.Group>
    </Col>
      <Col>
        <Form.Group>
          <Row><Col>
            <Form.Label className="filter_label mb-0" data-tip data-for="end_year">{translate[0]["end_year"][props.language]}</Form.Label>
               <ReactTooltip id="end_year" place="right" effect="solid">{translate[0]["enter_year"][props.language]}</ReactTooltip>
            <Form.Control
              type="text"
              name="end_year"
              aria-label={translate[0]["end_year"][props.language]}
              value={props.end_year}
              onChange={(i) =>  props.handleChange(i)}
              disabled={props.time_disable}
            />
          </Col></Row>
        </Form.Group>
      </Col>
    </Row>
  )
} else {return null}
};

// DEGREE FILTER ///////////////////////////////////////////////////////////////////////////////////////////////
function degreeFilters(props) {
if (props.selectedOption !== "") {return (
   <Form.Group className="mb-1">
     <Row><Col>
       <Form.Label className="filter_label mb-0" data-tip data-for="degree">{translate[0]["degrees_of_connection"][props.language]}</Form.Label>
          <ReactTooltip id="degree" place="right" effect="solid">{translate[0]["degree_note"][props.language]}</ReactTooltip>
       <Form.Select className="g-2" name="degree" aria-label={translate[0]["degrees_of_connection"][props.language]} value={props.degree} onChange={(i) =>  props.handleChange(i)}>
         <option value="1">1</option>
         <option value="2">2</option>
         <option value="3">3</option>
       </Form.Select>
     </Col></Row>
   </Form.Group>
 )
} else {return null}
};

// NODE TYPE INCLUDED FILTER ///////////////////////////////////////////////////////////////////////////////////
function includeFilters(props) {
if (props.selectedOption !== "") {return (
    <Form.Group className="mb-1">
      <Row><Col>
      <Form.Label className="filter_label mb-0" data-tip data-for="include_entities" aria-label={[translate[0]["include"][props.language]] [translate[0]["nodes"][props.language]]}>{translate[0]["include"][props.language]} {translate[0]["nodes"][props.language]}</Form.Label>
        <ReactTooltip id="include_entities" place="right" effect="solid">{translate[0]["include_entities"][props.language]}</ReactTooltip>
        <div key="default-checkbox1" className="mb-1">
          <Form.Check type="checkbox"
            name="people_include"
            label={translate[0]["people"][props.language]}
            aria-label={translate[0]["people"][props.language]}
            checked={props.people_include}
            onChange={(checked) =>  props.handleCheck(checked)}
          />
        </div>
        <div key="default-checkbox2" className="mb-1">
          <Form.Check type="checkbox"
            name="inst_include"
            label={translate[0]["institutions"][props.language]}
            aria-label={translate[0]["institutions"][props.language]}
            checked={props.inst_include}
            onChange={(checked) =>  props.handleCheck(checked)}
          />
        </div>
        <div key="default-checkbox3" className="mb-1">
          <Form.Check type="checkbox"
            name="corp_include"
            label={translate[0]["corporate_entities"][props.language]}
            aria-label={translate[0]["corporate_entities"][props.language]}
            checked={props.corp_include}
            onChange={(checked) =>  props.handleCheck(checked)}
          />
        </div>
        <div key="default-checkbox4" className="mb-1">
          <Form.Check type="checkbox"
            name="event_include"
            label={translate[0]["events"][props.language]}
            aria-label={translate[0]["events"][props.language]}
            checked={props.event_include}
            onChange={(checked) =>  props.handleCheck(checked)}
          />
        </div>
      </Col></Row>
    </Form.Group>
    )
  } else {return null}
};

// SUBMIT & RESET BUTTON ///////////////////////////////////////////////////////////////////////////////////
function submitButton(props) {
  if (props.selectedOption !== "") {return (
    <div classname="filter-buttons">
      <Row className="mb-1">
        <Col>
          <Button className="mb-1 col-12" variant="danger" onClick={() =>  props.fetchNetworkResults()}>{translate[0]["submit"][props.language]}</Button>
        </Col>
        <Col>
          <Button className="mb-1 col-12" variant="outline-danger" onClick={() => props.resetFilter()}>{translate[0]["reset"][props.language]}</Button>
        </Col>
      </Row>
    </div>
    )
  } else {return null}
};

 return (
   <div className="filter_area">
     <div className={props.filterDisplay}>
     <div className="filter_header">{translate[0]["network-parameters"][props.language]}</div>
     <div className="filter_scroll_area mb-4">
       <Form>

{/* FILTER AREA TOGGLER /////////////////////////////////////////////////////////////////////////////////// */}
       <div className="filter_button_container">
         <div onClick={() =>  props.filterHide()} className="filter_button" data-tip data-for="toggle">
           <ReactTooltip id="toggle" place="right" effect="solid">{translate[0]["toggle_filters"][props.language]}</ReactTooltip>
           <BsFilterLeft />
         </div>
      </div>
       {typeFilter(props)}
       {nodeFilters(props)}
       {degreeFilters(props)}
       {includeFilters(props)}
       {timeFilters(props)}
      </Form>
      </div>
        {submitButton(props)}
     </div>
   </div>
 )
}

/////////////////////////////////////////////////////////////////////////////////////////////////////
// EXPORT //////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

export default FilterNetwork
