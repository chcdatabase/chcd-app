import React from 'react'
import { Row, Col, Form, Button } from 'react-bootstrap';
import { BsFilterLeft, BsSearch } from 'react-icons/bs'
import Select from 'react-select'

import locations from "../../Assets/indexes/location-index.json"
import translate from "../../Assets/indexes/translate.json"


function FilterSearch(props) {

// SETUP DATA /////////////////////////////////////////////////////////////////////
  let data = props.instCatsIndex
  let subcat = []
  for (let i = 0; i < data.length; i++) {
    if (data[i][0] === props.institution_category){
      let data2 = data[i][1]
      for (let t = 0; t < data2.length; t++) {subcat.push(<option value={data2[t]}>{data2[t]}</option>)}
    }
    else {}
  }

  function sortByProperty(property){
    return function(a,b){
      if(a[property] > b[property]) return 1;
      else if(a[property] < b[property]) return -1;
    return 0;
   }
  }
  let locationAll = [{"name_zh": "都", "name_wes": "All"}];
  let locationList = locationAll.concat(locations.sort(sortByProperty("name_wes")));


// SETUP GENERAL FILTERS /////////////////////////////////////////////////////////////

  function timeFilter(props) {
    if (props.labelList.length > 1) { return (<Row className="mb-2">
       <Col><Form.Group><Row><Col>
          <Form.Label className="filter_label mb-0">{translate[0]["start_year"][props.language]}</Form.Label>
          <Form.Control type="text" name="start_year" value={props.start_year} onChange={(value) =>  props.handleChange(value)}/>
        </Col></Row></Form.Group></Col>
        <Col><Form.Group><Row><Col>
          <Form.Label className="filter_label mb-0">{translate[0]["end_year"][props.language]}</Form.Label>
          <Form.Control type="text" name="end_year" value={props.end_year} onChange={(value) =>  props.handleChange(value)}/>
        </Col></Row></Form.Group></Col>
      </Row>
  )} else { return null}
};

  function labelFilter(props) {
    if (props.labelList.length > 1) { return (<Form.Group className="mb-2"><Row><Col><Form.Label className="filter_label mb-0">
      {translate[0]["type"][props.language]}</Form.Label><div key="default-checkbox1" className="mb-1 filter-checkbox-list">
      {props.labelList.filter(i => (i !== undefined && i !== "County" && i !== "Village" && i !== "Township" && i !== "Prefecture" && i !== "Province")).map(i => (<Form.Check type="checkbox"
      name="label" label={i.replace(/([A-Z])/g, ' $1').trim()} value={i} onChange={(e) =>  props.handleFilterCheck(e)}/>))}</div></Col></Row></Form.Group>)} else { return null}
  };

  function relFamFilter(props) {
    if (props.relFamList.length > 1) { return (<Form.Group className="mb-2"><Row><Col><Form.Label className="filter_label mb-0">
      {translate[0]["religious_family"][props.language]}</Form.Label><div key="default-checkbox1" className="mb-1 filter-checkbox-list">
      {props.relFamList.filter(i => i !== undefined).map(i => (<Form.Check type="checkbox"
      name="religious_family" label={i} value={i} onChange={(e) =>  props.handleFilterCheck(e)}/>))}</div></Col></Row></Form.Group>)} else { return null}
  };

  function christTradFilter(props) {
    if (props.christTradList.length > 1) { return (<Form.Group className="mb-2"><Row><Col><Form.Label className="filter_label mb-0">
      {translate[0]["christian_tradition"][props.language]}</Form.Label><div key="default-checkbox1" className="mb-1 filter-checkbox-list">
      {props.christTradList.filter(i => i !== undefined).map(i => (<Form.Check type="checkbox"
      name="christian_tradition" label={i} value={i} onChange={(e) =>  props.handleFilterCheck(e)}/>))}</div></Col></Row></Form.Group>)} else { return null}
  };


  function generalFiltersDisplay(props) {return (
    <div><div className="filter_label text-danger h6 mb-0 ">{translate[0]["general-filter"][props.language]}</div><div className="border border-danger p-2 mb-2">
      {timeFilter(props)}{labelFilter(props)}{christTradFilter(props)}{relFamFilter(props)}
    </div></div>
  )}

// SETUP PERSON FILTERS /////////////////////////////////////////////////////////////

 function genderFilter(props) {
   if (props.genderList.length > 1 && props.label.includes("Person")) { return (<Form.Group className="mb-2"><Row><Col><Form.Label className="filter_label mb-0">
     {translate[0]["gender"][props.language]}</Form.Label><div key="default-checkbox1" className="mb-1 filter-checkbox-list">
     {props.genderList.filter(i => i !== undefined).map(i => (<Form.Check type="checkbox"
     name="gender" label={i} value={i} onChange={(e) =>  props.handleFilterCheck(e)}/>))}</div></Col></Row></Form.Group>)} else { return null}
 };

 function nationalityFilter(props) {
   if (props.nationalityList.length > 1 && props.label.includes("Person")) { return (<Form.Group className="mb-2"><Row><Col><Form.Label className="filter_label mb-0">
     {translate[0]["nationality"][props.language]}</Form.Label><div key="default-checkbox1" className="mb-1 filter-checkbox-list">
     {props.nationalityList.filter(i => i !== undefined).map(i => (<Form.Check type="checkbox"
     name="nationality" label={i} value={i} onChange={(e) =>  props.handleFilterCheck(e)}/>))}</div></Col></Row></Form.Group>)} else { return null}
  };

  function affFilter(props) {
    if (props.affList.length > 1 && props.label.includes("Person")) { return (<Form.Group className="mb-2"><Row><Col><Form.Label className="filter_label mb-0">
      {translate[0]["affiliation"][props.language]}</Form.Label><div key="default-checkbox1" className="mb-1 filter-checkbox-list">
      {props.affList.filter(i => i !== undefined).map(i => (<Form.Check type="checkbox"
      name="name_western" label={i} value={i} onChange={(e) =>  props.handleFilterCheck(e)}/>))}</div></Col></Row></Form.Group>)} else { return null}
   };

  function peopleFiltersDisplay(props) { if (props.label.includes("Person")) { return (
    <div><div className="filter_label text-danger h6 mb-0 ">{translate[0]["people-filter"][props.language]}</div><div className="border border-danger p-2 mb-2">
      {genderFilter(props)}{nationalityFilter(props)}{affFilter(props)}
    </div></div>
  )}};

// SETUP INST FILTERS /////////////////////////////////////////////////////////////
function instFilter(props) {
  if (props.instList.length > 1 && props.label.includes("Institution")) { return (<Form.Group className="mb-2"><Row><Col><Form.Label className="filter_label mb-0">
    {translate[0]["affiliation"][props.language]}</Form.Label><div key="default-checkbox1" className="mb-1 filter-checkbox-list">
    {props.instList.filter(i => i !== undefined).map(i => (<Form.Check type="checkbox"
    name="inst_name_western" label={i} value={i} onChange={(e) =>  props.handleFilterCheck(e)}/>))}</div></Col></Row></Form.Group>)} else { return null}
 };
 function instCatFilter(props) {
    if (props.instCatList.length > 0 && props.label.includes("Institution")) { return (<Form.Group className="mb-2"><Row><Col><Form.Label className="filter_label mb-0">
      {translate[0]["inst_category"][props.language]}</Form.Label><div key="default-checkbox1" className="mb-1 filter-checkbox-list">
      {props.instCatList.filter(i => i !== undefined).map(i => (<Form.Check type="checkbox"
      name="institution_category" label={i} value={i} onChange={(e) =>  props.handleFilterCheck(e)}/>))}</div></Col></Row></Form.Group>)} else { return null}
  };
  function instSubCatFilter(props) {
    if (props.instSubCatList.length > 0 && props.label.includes("Institution")) { return (<Form.Group className="mb-2"><Row><Col><Form.Label className="filter_label mb-0">
      {translate[0]["inst_subcategory"][props.language]}</Form.Label><div key="default-checkbox1" className="mb-1 filter-checkbox-list">
      {props.instSubCatList.filter(i => i !== undefined).map(i => (<Form.Check type="checkbox"
      name="institution_subcategory" label={i} value={i} onChange={(e) =>  props.handleFilterCheck(e)}/>))}</div></Col></Row></Form.Group>)} else { return null}
  };

  function instFiltersDisplay(props) { if (props.label.includes("Institution")) { return (
    <div><div className="filter_label text-danger h6 mb-0 ">{translate[0]["institution-filter"][props.language]}</div><div className="border border-danger p-2 mb-2">
      {instCatFilter(props)}{instSubCatFilter(props)}{instFilter(props)}
    </div></div>
  )}};


// SETUP CORP FILTERS /////////////////////////////////////////////////////////////
  function corpCatFilter(props) {
    if (props.corpCatList.length > 0 && props.label.includes("CorporateEntity")) { return (<Form.Group className="mb-2"><Row><Col><Form.Label className="filter_label mb-0">
      {translate[0]["corp_category"][props.language]}</Form.Label><div key="default-checkbox1" className="mb-1 filter-checkbox-list">
      {props.corpCatList.filter(i => i !== undefined).map(i => (<Form.Check type="checkbox"
      name="corporate_entity_category" label={i} value={i} onChange={(e) =>  props.handleFilterCheck(e)}/>))}</div></Col></Row></Form.Group>)} else { return null}
  };
  function corpSubCatFilter(props) {
    if (props.corpSubCatList.length > 0 && props.label.includes("CorporateEntity")) { return (<Form.Group className="mb-2"><Row><Col><Form.Label className="filter_label mb-0">
      {translate[0]["corp_subcategory"][props.language]}</Form.Label><div key="default-checkbox1" className="mb-1 filter-checkbox-list">
      {props.corpSubCatList.filter(i => i !== undefined).map(i => (<Form.Check type="checkbox"
      name="corporate_entity_subcategory" label={i} value={i} onChange={(e) =>  props.handleFilterCheck(e)}/>))}</div></Col></Row></Form.Group>)} else { return null}
  };

  function corpFiltersDisplay(props) { if (props.label.includes("CorporateEntity")) { return (
    <div><div className="filter_label text-danger h6 mb-0 ">{translate[0]["corp-filter"][props.language]}</div><div className="border border-danger p-2 mb-2">
      {corpCatFilter(props)}{corpSubCatFilter(props)}
    </div></div>
  )}};

// SETUP EVENT FILTERS /////////////////////////////////////////////////////////////
  function eventCatFilter(props) {
    if (props.eventCatList.length > 0 && props.label.includes("Event")) { return (<Form.Group className="mb-2"><Row><Col><Form.Label className="filter_label mb-0">
      {translate[0]["event_category"][props.language]}</Form.Label><div key="default-checkbox1" className="mb-1 filter-checkbox-list">
      {props.eventCatList.filter(i => i !== undefined).map(i => (<Form.Check type="checkbox"
      name="event_category" label={i} value={i} onChange={(e) =>  props.handleFilterCheck(e)}/>))}</div></Col></Row></Form.Group>)} else { return null}
  };
  function eventSubCatFilter(props) {
    if (props.eventSubCatList.length > 0 && props.label.includes("Event")) { return (<Form.Group className="mb-2"><Row><Col><Form.Label className="filter_label mb-0">
    {translate[0]["event_subcategory"][props.language]}</Form.Label><div key="default-checkbox1" className="mb-1 filter-checkbox-list">
      {props.eventSubCatList.filter(i => i !== undefined).map(i => (<Form.Check type="checkbox"
      name="event_subcategory" label={i} value={i} onChange={(e) =>  props.handleFilterCheck(e)}/>))}</div></Col></Row></Form.Group>)} else { return null}
  };

  function eventFiltersDisplay(props) { if (props.label.includes("Event")) { return (
    <div><div className="filter_label text-danger h6 mb-0 ">{translate[0]["event-filter"][props.language]}</div><div className="border border-danger p-2 mb-2">
      {eventCatFilter(props)}{eventSubCatFilter(props)}
    </div></div>
  )}};


// RETURNS /////////////////////////////////////////////////////////////////////
  if (props.nodeArray.length === 0) {
    return (
      <div className="filter_area">
        <div className={props.filterDisplay}>
          <div className="filter_header">{translate[0]["filter-results"][props.language]}</div>
                <div className="results-container d-flex justify-content-center opacity-25">
                <Row className="align-items-center"><Col className="col-12">
                  <BsSearch size="6em" className="d-flex mb-3 m-auto"/>
                  <h4 >{translate[0]["search-prompt"][props.language]}</h4>
                </Col></Row>
                </div>
          <div className="filter_button_container">
            <div onClick={() =>  props.filterHide()} className="filter_button">
              <BsFilterLeft />
            </div>
          </div>
        </div>
      </div>
    )
  }

  else {
    return (
      <div className="filter_area">
        <div className={props.filterDisplay}>
          <div className="filter_header">{translate[0]["filter-results"][props.language]}</div>
          <div className="filter_scroll_area mb-4">
            {generalFiltersDisplay(props)}
            {peopleFiltersDisplay(props)}
            {instFiltersDisplay(props)}
            {corpFiltersDisplay(props)}
            {eventFiltersDisplay(props)}
          </div>
          {/* BUTTONS SELECT ------------------------------------ */}
          <div classname="filter-buttons">
            <Row className="mb-2">
              <Col>
                <Button className="mb-2 col-12" variant="danger" onClick={() =>  props.filterResults()}>{translate[0]["filter"][props.language]}</Button>
              </Col>
              <Col>
                <Button className="mb-2 col-12" variant="outline-danger" onClick={() =>  props.clearFilters()}>{translate[0]["clear-all"][props.language]}</Button>
              </Col>
            </Row>
          </div>
          {/* FILTER TOGGLE SELECT ------------------------------------ */}
          <div className="filter_button_container">
            <div onClick={() =>  props.filterHide()} className="filter_button">
              <BsFilterLeft />
            </div>
          </div>
        </div>
      </div>
    )
  }

}


export default FilterSearch
