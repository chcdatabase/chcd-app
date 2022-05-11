/////////////////////////////////////////////////////////////////////////////////////////////////////
// IMPORTS //////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////
import React from 'react'
import { Row, Col, Form, Button } from 'react-bootstrap';
import { BsFilterLeft, BsSearch } from 'react-icons/bs'
import Select from 'react-select'
import ReactTooltip from "react-tooltip"
import locations from "../../Assets/indexes/location-index.json"
import translate from "../../Assets/indexes/translate.json"
import nationality from "../../Assets/indexes/nationality.json"
import family_trans from "../../Assets/indexes/religious_family.json"
import cat_trans from "../../Assets/indexes/categories.json"

/////////////////////////////////////////////////////////////////////////////////////////////////////
// COMPONENT ////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

function FilterSearch(props) {

// SETUP DATA //////////////////////////////////////////////////////////////////////////////////////

  //PROPERTY SORTER
  function sortByProperty(property){
    return function(a,b){
      if(a[property] > b[property]) return 1;
      else if(a[property] < b[property]) return -1;
    return 0;
   }
  }

  // SORT LOCATION LIST USING PROERTY SORTER
  let locationAll = [{"name_zh": "都", "name_wes": "All"}];
  let locationList = locationAll.concat(locations.sort(sortByProperty("name_wes")));

  // PREPARE CATEGORIES AND SUBCATEGORIES
  let data = props.instCatsIndex
  let subcat = []
  for (let i = 0; i < data.length; i++) {
    if (data[i][0] === props.institution_category){
      let data2 = data[i][1]
      for (let t = 0; t < data2.length; t++) {subcat.push(<option value={data2[t]}>{data2[t]}</option>)}
    }
    else {}
  }


// SETUP GENERAL FILTERS /////////////////////////////////////////////////////////////////////////////

  // TIME FILTERS
  function timeFilter(props) {
    if (props.labelList.length > 0) { return (<Row className="mb-1">
       <Col><Form.Group><Row><Col>
         <Form.Label className="filter_label mb-0" data-tip data-for="start_year">{translate[0]["start_year"][props.language]}</Form.Label>
           <ReactTooltip id="start_year" place="right" effect="solid">{translate[0]["enter_year"][props.language]}</ReactTooltip>
          <Form.Control
            type="text"
            name="start_year"
            aria-label={translate[0]["start_year"][props.language]}
            value={props.start_year}
            onChange={(value) =>  props.handleChange(value)}
          />
        </Col></Row></Form.Group></Col>
        <Col><Form.Group><Row><Col>
          <Form.Label className="filter_label mb-0" data-tip data-for="end_year">{translate[0]["end_year"][props.language]}</Form.Label>
            <ReactTooltip id="end_year" place="right" effect="solid">{translate[0]["enter_year"][props.language]}</ReactTooltip>
          <Form.Control
            type="text"
            name="end_year"
            aria-label={translate[0]["end_year"][props.language]}
            value={props.end_year}
            onChange={(value) =>  props.handleChange(value)}
          />
        </Col></Row></Form.Group></Col>
      </Row>
  )} else { return null }
};

  // TIME NODE TYPE FILTER
  function labelFilter(props) {
    if (props.labelList.length > 1) { return (<Form.Group className="mb-1"><Row><Col>
      <Form.Label className="filter_label mb-0" data-tip data-for="type">{translate[0]["type"][props.language]}</Form.Label>
        <ReactTooltip id="type" place="right" effect="solid">{translate[0]["select_start"][props.language]} {translate[0]["type"][props.language]}</ReactTooltip>
        <div key="default-checkbox1" className="mb-1 filter-checkbox-list">
        {props.labelList.filter(i => (i !== undefined && i !== "County" && i !== "Village" && i !== "Township" && i !== "Prefecture" && i !== "Province")).map(i => (
          <Form.Check
            type="checkbox"
            name="label"
            label={translate[0][i.replace(/([A-Z])/g, '_$1').replace(/\s+$/, '').replace(/\s|\//g, '_').substring(1).toLowerCase()][props.language]}
            aria-label={translate[0][i.replace(/([A-Z])/g, '_$1').replace(/\s+$/, '').replace(/\s|\//g, '_').substring(1).toLowerCase()][props.language]}
            value={i}
            onChange={(e) =>  props.handleFilterCheck(e)}
          />))}
        </div>
      </Col></Row></Form.Group>
    )} else { return null }
  };

  // RELIGIOUS FAMILY FILTER
  function relFamFilter(props) {
    if (props.relFamList.length > 1) { return (<Form.Group className="mb-1"><Row><Col>
      <Form.Label className="filter_label mb-0" data-tip data-for="religious_family">{translate[0]["religious_family"][props.language]}</Form.Label>
        <ReactTooltip id="religious_family" place="right" effect="solid">{translate[0]["select_start"][props.language]} {translate[0]["religious_family"][props.language]}</ReactTooltip>
        <div key="default-checkbox1" className="mb-1 filter-checkbox-list">
        {props.relFamList.filter(i => i !== undefined).map(i => (
          <Form.Check
            type="checkbox"
            name="religious_family"
            label={family_trans[0][i.replace(/\s+$/, '').replace(/\s|\//g, '_').toLowerCase()][props.language]}
            aria-label={family_trans[0][i.replace(/\s+$/, '').replace(/\s|\//g, '_').toLowerCase()][props.language]}
            value={i}
            onChange={(e) =>  props.handleFilterCheck(e)}
          />))}
        </div>
      </Col></Row></Form.Group>
    )} else { return null }
  };

  // CHRISTIAN TRADITION FILTER
  function christTradFilter(props) {
    if (props.christTradList.length > 1) { return (<Form.Group className="mb-1"><Row><Col>
      <Form.Label className="filter_label mb-0" data-tip data-for="christian_tradition">{translate[0]["christian_tradition"][props.language]}</Form.Label>
        <ReactTooltip id="christian_tradition" place="right" effect="solid">{translate[0]["select_start"][props.language]} {translate[0]["christian_tradition"][props.language]}</ReactTooltip>
        <div key="default-checkbox1" className="mb-1 filter-checkbox-list">
        {props.christTradList.filter(i => i !== undefined).map(i => (
          <Form.Check
            type="checkbox"
            name="christian_tradition"
            aria-label={translate[0][i.replace(/\s+$/, '').replace(/\s|\//g, '_').toLowerCase()][props.language]}
            label={translate[0][i.replace(/\s+$/, '').replace(/\s|\//g, '_').toLowerCase()][props.language]}
            value={i}
            onChange={(e) =>  props.handleFilterCheck(e)}
          />))}
        </div>
      </Col></Row></Form.Group>
    )} else { return null }
  };

  // GENERAL FILTERS CONSTRUCTOR
  function generalFiltersDisplay(props) {return (
    <div>
      <div className="filter_label text-danger h6 mb-0">{translate[0]["general-filter"][props.language]}</div>
      <div className="border border-danger p-2 mb-1">
        {timeFilter(props)}{labelFilter(props)}{christTradFilter(props)}{relFamFilter(props)}
      </div>
    </div>
  )}

// SETUP PERSON FILTERS //////////////////////////////////////////////////////////////////////////////

 // GENDER FILTER
 function genderFilter(props) {
   if (props.genderList.length > 1 && props.label.includes("Person")) { return (<Form.Group className="mb-1"><Row><Col>
    <Form.Label className="filter_label mb-0" data-tip data-for="gender">{translate[0]["gender"][props.language]}</Form.Label>
        <ReactTooltip id="gender" place="right" effect="solid">{translate[0]["select_start"][props.language]} {translate[0]["gender"][props.language]}</ReactTooltip>
      <div key="default-checkbox1" className="mb-1 filter-checkbox-list">
      {props.genderList.filter(i => i !== undefined).map(i => (
        <Form.Check
          type="checkbox"
          name="gender"
          label={translate[0][i.toLowerCase()][props.language]}
          aria-label={translate[0][i.toLowerCase()][props.language]}
          value={i}
          onChange={(e) =>  props.handleFilterCheck(e)}
        />))}
      </div>
    </Col></Row></Form.Group>
  )} else { return null }
 };

 // NATIONALITY FILTER
 function nationalityFilter(props) {
   if (props.nationalityList.length > 1 && props.label.includes("Person")) { return (<Form.Group className="mb-1"><Row><Col>
    <Form.Label className="filter_label mb-0" data-tip data-for="nationality">{translate[0]["nationality"][props.language]}</Form.Label>
        <ReactTooltip id="nationality" place="right" effect="solid">{translate[0]["select_start"][props.language]} {translate[0]["nationality"][props.language]}</ReactTooltip>
      <div key="default-checkbox1" className="mb-1 filter-checkbox-list">
      {props.nationalityList.filter(i => i !== undefined).map(i => (
        <Form.Check
          type="checkbox"
          name="nationality"
          label={nationality[0][i.replace(/\s+$/, '').replace(/\s|\//g, '_').toLowerCase()][props.language]}
          aria-label={nationality[0][i.replace(/\s+$/, '').replace(/\s|\//g, '_').toLowerCase()][props.language]}
          value={i}
          onChange={(e) =>  props.handleFilterCheck(e)}
        />))}
      </div>
    </Col></Row></Form.Group>
   )} else { return null }
  };

  // AFFILIATION FILTER
  function affFilter(props) {
   if (props.affList.length > 1 && props.label.includes("Person")) { return (<Form.Group className="mb-1"><Row><Col>
    <Form.Label className="filter_label mb-0" data-tip data-for="affiliation">{translate[0]["affiliation"][props.language]}</Form.Label>
        <ReactTooltip id="affiliation" place="right" effect="solid">{translate[0]["select_start"][props.language]} {translate[0]["affiliation"][props.language]}</ReactTooltip>
      <div key="default-checkbox1" className="mb-1 filter-checkbox-list">
      {props.affList.filter(i => i !== undefined).map(i => (
        <Form.Check
          type="checkbox"
          name="name_western"
          label={i}
          aria-label={i}
          value={i}
          onChange={(e) =>  props.handleFilterCheck(e)}
        />))}
      </div>
    </Col></Row></Form.Group>
   )} else { return null }
  };

  // PERSON FILTER CONSTRUCTOR
  function peopleFiltersDisplay(props) { if (props.label.includes("Person")) { return (
    <div>
      <div className="filter_label text-danger h6 mb-0 mt-2">{translate[0]["people-filter"][props.language]}</div>
      <div className="border border-danger p-2 mb-1">
        {genderFilter(props)}{nationalityFilter(props)}{affFilter(props)}
      </div>
    </div>
  )}};

// SETUP INST FILTERS ////////////////////////////////////////////////////////////////////////////////

 //INSTITUTONAL CATEGORY FILTER
 function instCatFilter(props) {
    if (props.instCatList.length > 0 && props.label.includes("Institution")) { return (<Form.Group className="mb-1"><Row><Col>
      <Form.Label className="filter_label mb-0" data-tip data-for="inst_category">{translate[0]["inst_category"][props.language]}</Form.Label>
        <ReactTooltip id="inst_category" place="right" effect="solid">{translate[0]["select_start"][props.language]} {translate[0]["inst_category"][props.language]}</ReactTooltip>
        <div key="default-checkbox1" className="mb-1 filter-checkbox-list">
        {props.instCatList.filter(i => i !== undefined).map(i => (
          <Form.Check
            type="checkbox"
            name="institution_category"
            label={cat_trans[0][i.replace(/\s+$/, '').replace(/\s|\//g, '_').toLowerCase()][props.language]}
            aria-label={cat_trans[0][i.replace(/\s+$/, '').replace(/\s|\//g, '_').toLowerCase()][props.language]}
            value={i}
            onChange={(e) =>  props.handleFilterCheck(e)}
          />
          )
        )}
        </div>
      </Col></Row></Form.Group>
    )} else { return null }
  };

  //INSTITUTONAL SUBCATEGORY FILTER
  function instSubCatFilter(props) {
    if (props.instSubCatList.length > 0 && props.label.includes("Institution")) { return (<Form.Group className="mb-1"><Row><Col>
      <Form.Label className="filter_label mb-0" data-tip data-for="inst_subcategory">{translate[0]["inst_subcategory"][props.language]}</Form.Label>
        <ReactTooltip id="inst_subcategory" place="right" effect="solid">{translate[0]["select_start"][props.language]} {translate[0]["inst_subcategory"][props.language]}</ReactTooltip>
        <div key="default-checkbox1" className="mb-1 filter-checkbox-list">
        {props.instSubCatList.filter(i => i !== undefined).map(i => (
          <Form.Check
            type="checkbox"
            name="institution_subcategory"
            label={cat_trans[0][i.replace(/\s+$/, '').replace(/\s|\//g, '_').toLowerCase()][props.language]}
            aria-label={cat_trans[0][i.replace(/\s+$/, '').replace(/\s|\//g, '_').toLowerCase()][props.language]}
            value={i}
            onChange={(e) =>  props.handleFilterCheck(e)}
          />))}
        </div>
      </Col></Row></Form.Group>
    )} else { return null }
  };

  // INSTITUTIONAL FILTERS CONSTRUCTOR
  function instFiltersDisplay(props) { if (props.label.includes("Institution")) { return (
    <div>
      <div className="filter_label text-danger h6 mb-0 mt-2">{translate[0]["institution-filter"][props.language]}</div>
      <div className="border border-danger p-2 mb-1">
        {instCatFilter(props)}{instSubCatFilter(props)}
      </div>
    </div>
  )}};


// SETUP CORPORATE ENTITY FILTERS ////////////////////////////////////////////////////////////////////

  // CORPORATE ENTITY CATEGORY FILTER
  function corpCatFilter(props) {
    if (props.corpCatList.length > 0 && props.label.includes("CorporateEntity")) { return (<Form.Group className="mb-1"><Row><Col>
      <Form.Label className="filter_label mb-0" data-tip data-for="corp_category">{translate[0]["corp_category"][props.language]}</Form.Label>
        <ReactTooltip id="corp_category" place="right" effect="solid">{translate[0]["select_start"][props.language]} {translate[0]["corp_category"][props.language]}</ReactTooltip>
        <div key="default-checkbox1" className="mb-1 filter-checkbox-list">
        {props.corpCatList.filter(i => i !== undefined).map(i => (
          <Form.Check
            type="checkbox"
            name="corporate_entity_category"
            label={cat_trans[0][i.replace(/\s+$/, '').replace(/\s|\//g, '_').toLowerCase()][props.language]}
            aria-label={cat_trans[0][i.replace(/\s+$/, '').replace(/\s|\//g, '_').toLowerCase()][props.language]}
            value={i}
            onChange={(e) =>  props.handleFilterCheck(e)}
          />))}
        </div>
      </Col></Row></Form.Group>
    )} else { return null }
  };

  // CORPORATE ENTITY SUBCATEGORY FILTER
  function corpSubCatFilter(props) {
    if (props.corpSubCatList.length > 0 && props.label.includes("CorporateEntity")) { return (<Form.Group className="mb-1"><Row><Col>
      <Form.Label className="filter_label mb-0" data-tip data-for="corp_subcategory">{translate[0]["corp_subcategory"][props.language]}</Form.Label>
        <ReactTooltip id="corp_subcategory" place="right" effect="solid">{translate[0]["select_start"][props.language]} {translate[0]["corp_subcategory"][props.language]}</ReactTooltip>
        <div key="default-checkbox1" className="mb-1 filter-checkbox-list">
        {props.corpSubCatList.filter(i => i !== undefined).map(i => (
          <Form.Check
            type="checkbox"
            name="corporate_entity_subcategory"
            label={cat_trans[0][i.replace(/\s+$/, '').replace(/\s|\//g, '_').toLowerCase()][props.language]}
            aria-label={cat_trans[0][i.replace(/\s+$/, '').replace(/\s|\//g, '_').toLowerCase()][props.language]}
            value={i}
            onChange={(e) =>  props.handleFilterCheck(e)}
          />))}
        </div>
      </Col></Row></Form.Group>
    )} else { return null }
  };

  // CORPORATE ENTITY FILTERS CONSTRUCTOR
  function corpFiltersDisplay(props) { if (props.label.includes("CorporateEntity")) { return (
    <div>
      <div className="filter_label text-danger h6 mb-0 mt-2">{translate[0]["corp-filter"][props.language]}</div>
      <div className="border border-danger p-2 mb-1">
        {corpCatFilter(props)}{corpSubCatFilter(props)}
      </div>
    </div>
  )}};

// SETUP EVENT FILTERS ///////////////////////////////////////////////////////////////////////////////

  //EVENT CATEGORY FILTER
  function eventCatFilter(props) {
    if (props.eventCatList.length > 0 && props.label.includes("Event")) { return (<Form.Group className="mb-1"><Row><Col>
      <Form.Label className="filter_label mb-0" data-tip data-for="event_category">{translate[0]["event_category"][props.language]}</Form.Label>
        <ReactTooltip id="event_category" place="right" effect="solid">{translate[0]["select_start"][props.language]} {translate[0]["event_category"][props.language]}</ReactTooltip>
        <div key="default-checkbox1" className="mb-1 filter-checkbox-list">
        {props.eventCatList.filter(i => i !== undefined).map(i => (
          <Form.Check
            type="checkbox"
            name="event_category"
            label={cat_trans[0][i.replace(/\s+$/, '').replace(/\s|\//g, '_').toLowerCase()][props.language]}
            aria-label={cat_trans[0][i.replace(/\s+$/, '').replace(/\s|\//g, '_').toLowerCase()][props.language]}
            value={i}
            onChange={(e) =>  props.handleFilterCheck(e)}
          />))}
        </div>
      </Col></Row></Form.Group>
    )} else { return null }
  };

  //EVENT SUBCATEGORY FILTER
  function eventSubCatFilter(props) {
    if (props.eventSubCatList.length > 0 && props.label.includes("Event")) { return (<Form.Group className="mb-1"><Row><Col>
      <Form.Label className="filter_label mb-0" data-tip data-for="event_subcategory">{translate[0]["event_subcategory"][props.language]}</Form.Label>
        <ReactTooltip id="event_subcategory" place="right" effect="solid">{translate[0]["select_start"][props.language]} {translate[0]["event_subcategory"][props.language]}</ReactTooltip>
        <div key="default-checkbox1" className="mb-1 filter-checkbox-list">
        {props.eventSubCatList.filter(i => i !== undefined).map(i => (
          <Form.Check
            type="checkbox"
            name="event_subcategory"
            label={cat_trans[0][i.replace(/\s+$/, '').replace(/\s|\//g, '_').toLowerCase()][props.language]}
            aria-label={cat_trans[0][i.replace(/\s+$/, '').replace(/\s|\//g, '_').toLowerCase()][props.language]}
            value={i}
            onChange={(e) =>  props.handleFilterCheck(e)}
          />))}
        </div>
      </Col></Row></Form.Group>
    )} else { return null }
  };

  // EVENT FILTERS CONSTRUCTOR
  function eventFiltersDisplay(props) { if (props.label.includes("Event")) { return (
    <div>
      <div className="filter_label text-danger h6 mb-0 mt-2">{translate[0]["event-filter"][props.language]}</div>
      <div className="border border-danger p-2 mb-1">
        {eventCatFilter(props)}{eventSubCatFilter(props)}
      </div>
    </div>
  )}};


// RETURNS ///////////////////////////////////////////////////////////////////////////////////////////

  // INITIAL LOAD RETURN
  if (props.nodeArray.length === 0) {
    return (
      <div className="filter_area">
        <div className={props.filterDisplay}>
          <div className="filter_header">{translate[0]["filter-results"][props.language]}</div>
          <div className="results-container d-flex justify-content-center">
            <Row className="align-items-center"><Col className="col-12">
              <BsSearch size="6em" className="d-flex mb-3 m-auto"/>
              <h4 >{translate[0]["search-prompt"][props.language]}</h4>
            </Col></Row>
          </div>
          <div className="filter_button_container">
            <div onClick={() =>  props.filterHide()} className="filter_button" data-tip data-for="toggle">
              <ReactTooltip id="toggle" place="right" effect="solid">{translate[0]["toggle_filters"][props.language]}</ReactTooltip>
              <BsFilterLeft />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // INITIAL LOAD RETURN
  else {
    return (
      <div className="filter_area">
        <div className={props.filterDisplay}>
          <div className="filter_header">{translate[0]["filter-results"][props.language]}</div>

{/* FILTER CONSTRUCTION /////////////////////////////////////////////////////////////////////////////////// */}
          <div className="filter_scroll_area mb-4">
            {generalFiltersDisplay(props)}
            {peopleFiltersDisplay(props)}
            {instFiltersDisplay(props)}
            {corpFiltersDisplay(props)}
            {eventFiltersDisplay(props)}
          </div>

{/* SUBMIT & RESET BUTTON /////////////////////////////////////////////////////////////////////////////////// */}
          <div classname="filter-buttons">
            <Row className="mb-1">
              <Col>
                <Button className="mb-1 col-12" variant="danger" onClick={() =>  props.filterResults()}>{translate[0]["filter"][props.language]}</Button>
              </Col>
              <Col>
                <Button className="mb-1 col-12" variant="outline-danger" onClick={() =>  props.clearFilters()}>{translate[0]["clear-all"][props.language]}</Button>
              </Col>
            </Row>
          </div>

{/* FILTER AREA TOGGLER /////////////////////////////////////////////////////////////////////////////////// */}
          <div className="filter_button_container">
            <div onClick={() =>  props.filterHide()} className="filter_button" data-tip data-for="toggle">
              <ReactTooltip id="toggle" place="right" effect="solid">{translate[0]["toggle_filters"][props.language]}</ReactTooltip>
              <BsFilterLeft />
            </div>
          </div>

        </div>
      </div>
    )
  }

}

/////////////////////////////////////////////////////////////////////////////////////////////////////
// EXPORT //////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

export default FilterSearch
