// IMPORTS ////////////////////////////////////////////////////////////////////

// MAIN DEPENDENCIES
import React, { useState } from 'react';
import { Row, Col, Spinner, InputGroup, FormControl, Button } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import Pagination from "react-js-pagination";

import translate from "../../Assets/indexes/translate.json"
import nationality from "../../Assets/indexes/nationality.json"
import family_trans from "../../Assets/indexes/religious_family.json"
import cat_trans from "../../Assets/indexes/categories.json"



// FUNCTIONAL COMPONENT ////////////////////////////////////////////////////////

function SearchResults(props) {

  // FILTERS NODES TO UNIQUE INDIVIDUALS (IGNORES RELATIONSHIPS)

  const unfiltArray = props.filterArray.filter((e, i) => {
    return props.filterArray.findIndex((x) => {
      return x.key === e.key
    }) === i;
  });
  //CONSTRUCT PAGINATION
  const [currentPage, setCurrentPage] = useState(1);
  const totalRecords = unfiltArray.length; // total number of the records
  const recordPerPage = 20; // total records per page to display
  const pageRange = 10; // range of pages in paginator

  // handle change event
  const handlePageChange = pageNumber => {
    setCurrentPage(pageNumber);
  }
  let uniqueArray;
  if (currentPage === 1) {uniqueArray = unfiltArray.slice(0, recordPerPage)}
  else {
    let start = (currentPage - 1) * recordPerPage
    let end = currentPage * recordPerPage
    uniqueArray = unfiltArray.slice(start, end)};

  //CONSTRUCTS SEARCH BAR
  function searchField(props) { return (
    <Row classname="d-flex align-items-start"><Col>
      <InputGroup className="mt-4">
        <FormControl
          placeholder={translate[0]["search"][props.language]}
          aria-label={translate[0]["search"][props.language]}
          aria-describedby="basic-search"
          value={props.search}
          name="search"
          onChange={(value) =>  {value.preventDefault(); props.handleChange(value)}}
          onKeyPress={(e, value) =>  {if (e.key === "Enter") {e.preventDefault(); props.fetchSearch(value); setCurrentPage(1)} else {}}}
        />
        <Button variant="danger" id="basic-search" onClick={(value) => {props.fetchSearch(value); setCurrentPage(1)}}>
          <FaSearch />
        </Button>
      </InputGroup>
    </Col></Row>
  )}

  //MAPS RESULTS TO TEMPLATE
  function displayMapper(array) {
    const disp = array.map((node, index) => {
      //SET NAME FOR RELATIONSHIP
      let otherVal;
      if (node.other.family_name_western) {otherVal = `${node.other.given_name_western} ${node.other.family_name_western}`}
      else {otherVal = node.other.name_western};
      //SET ALTERNATE NAME VALUES
      let altVal; let altDisp; let a1; let a2; let a3; let a4; let a5; let a6; let a7;
      if (node.label === "Person") {
        if (node.properties.alternative_name_western) {a1 = node.properties.alternative_name_western}
        if (node.properties.chinese_family_name_hanzi) {a2 =node.properties.chinese_name_hanzi}
        if (node.properties.chinese_given_name_hanzi) {a3 =node.properties.chinese_name_hanzi}
        if (node.properties.alternative_chinese_name_hanzi) {a4 = node.properties.alternative_chinese_name_hanzi}
        if (node.properties.chinese_family_name_romanized) {a5 = node.properties.chinese_name_romanized}
        if (node.properties.chinese_given_name_romanized) {a6 = node.properties.chinese_name_romanized}
        if (node.properties.alternative_chinese_name_romanized) {a7 = node.properties.alternative_chinese_name_romanized}
        altVal = [a1, a2, a3, a4, a5, a6, a7].filter(Boolean).join("; ");
      }
      else {
        if (node.properties.alternative_name_western) {a1 = node.properties.alternative_name_western}
        if (node.properties.chinese_name_hanzi) {a2 =node.properties.chinese_name_hanzi}
        if (node.properties.alternative_chinese_name_hanzi) {a3 = node.properties.alternative_chinese_name_hanzi}
        if (node.properties.chinese_name_romanized) {a4 = node.properties.chinese_name_romanized}
        if (node.properties.alternative_chinese_name_romanized) {a5 = node.properties.alternative_chinese_name_romanized}
        altVal = [a1, a2, a3, a4, a5, a6, a7].filter(Boolean).join("; ");
      }
        if (altVal.length > 0) {altDisp = <Row><Col className="card_sources pt-1">{altVal}</Col></Row>}
      //SET NAME
      let nameVal;
      if (node.label === "Person") {
        if ((props.language == "zh" || props.language == "tw") && node.properties.chinese_given_name_hanzi) {nameVal = `${node.properties.chinese_family_name_western} ${node.properties.chinese_given_name_western}`}
        else {nameVal = `${node.properties.given_name_western} ${node.properties.family_name_western}`}
        }
      else {
        if ((props.language == "zh" || props.language == "tw") && node.properties.chinese_name_hanzi) {nameVal = node.properties.chinese_name_hanzi}
        else {nameVal = node.properties.name_western}
      }

      //SET TYPE & STYLE
      let typeVal; let typeStyle;
      if (node.label === "CorporateEntity") {typeVal = translate[0]["corporate_entity"][props.language]; typeStyle = "d-inline-block font-weight-bold mt-1 p-2 badge bg-info"}
      else if (node.label === "Person") {typeVal = translate[0][node.label.toLowerCase()][props.language]; typeStyle = "d-inline-block font-weight-bold mt-1 p-2 badge bg-danger"}
      else if (node.label === "Institution") {typeVal = translate[0][node.label.toLowerCase()][props.language]; typeStyle = "d-inline-block font-weight-bold mt-1 p-2 badge bg-secondary"}
      else if (node.label === "Event") {typeVal = translate[0][node.label.toLowerCase()][props.language]; typeStyle = "d-inline-block font-weight-bold mt-1 p-2 badge bg-warning"};


      return (
      <li className="list-group-item pt-1 pb-1"><div className="card-body px-1 p-1"><Row>
        <Col className="col-7">
          <Row><Col className="text-start"><span className="popup_link" data-prop="popupcontainer" onClick={() => props.selectSwitchInitial((node.key))}>{nameVal}</span></Col></Row>
          {altDisp}
          <Row><Col className="card_sources pt-1">{node.rel} - {otherVal}</Col></Row>
        </Col>
        <Col className="col-5 text-end">
          {props.linkCheck(props, node)}
          <div className={typeStyle}>{typeVal}</div>
        </Col>
      </Row></div></li>
    )
  });
    return disp;
  }

  // RETURNS SPINNER ON CONTENT LOADING STATE
  if (props.content === "loading") { return (
      <div className="list_container">
        <div className="list_float d-flex align-items-center justify-content-center">
          <Row><Col>
          <Spinner animation="border" role="status" variant="light"><span className="visually-hidden hide">Loading...</span></Spinner>
          </Col></Row>
        </div>
      </div>
   )}

  // RETURNS PLACHOLDER ON LOAD
  else if (props.nodeArray.length === 0) { return (
    <div className="list_container">
      <div className="list_float d-flex flex-column">
          {searchField(props)}
          <Row className="m-auto p-2"><Col className="">
            <div className="list_placeholder"> </div>
          </Col></Row>
      </div>
    </div>
  )}

  // RETURNS SEARCH RESULT LIST
  else { return (
    <div className="list_container">
      <div className="list_float">
      {searchField(props)}
        <Row>
          <Col className="mb-2 mt-3 text-dark"><h5>Results for "{props.search_set}"</h5></Col>
        </Row>
        <div className="card">
          <ul className="list-group list-group-flush">
          {displayMapper(uniqueArray)}
          </ul>
        </div>
        <Pagination
          activePage={currentPage}
          itemsCountPerPage={recordPerPage}
          totalItemsCount={totalRecords}
          pageRangeDisplayed={pageRange}
          onChange={handlePageChange}
          innerClass="pagination d-flex justify-content-center m-2 pb-3"
          itemClass="page-item "
          linkClass="page-link text-danger"
          activeClass="active"
          activeLinkClass="bg-danger text-light border border-danger"
          hideNavigation={true}
          hideFirstLastPages={true}
        />
      </div>
    </div>
  )}

}

export default SearchResults
