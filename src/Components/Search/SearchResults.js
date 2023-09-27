/////////////////////////////////////////////////////////////////////////////////////////////////////
// IMPORTS //////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

import React, { useState } from 'react';
import { Row, Col, Spinner, InputGroup, FormControl, Button } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import Pagination from "react-js-pagination";
import translate from "../../Assets/indexes/translate.json"
import { useSearchParams } from 'react-router-dom'
import relationships from "../../Assets/indexes/relationships.json"

/////////////////////////////////////////////////////////////////////////////////////////////////////
// COMPONENT ////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

function SearchResults(props) {

  const [searchParams, setSearchParams] = useSearchParams();

  // FILTERS NODES TO UNIQUE INDIVIDUALS (IGNORES RELATIONSHIPS)
  const unfiltArray = props.filterArray.filter((e, i) => {
    return props.filterArray.findIndex((x) => {
      return x.key === e.key
    }) === i;
  });

  //CONSTRUCT PAGINATION
  const [currentPage, setCurrentPage] = useState(1);
  const totalRecords = unfiltArray.length; // SET TOTAL NUMBER OF RECORDS
  const recordPerPage = 20; // SET RECORDS PER PAGE
  const pageRange = 10; // SET RANGE OF PAGINATOR

  // HANDLE PAGE CHANGE
  const handlePageChange = pageNumber => {
    setCurrentPage(pageNumber);
    props.reFilterSet();
  }

  //CONSTRUCT PAGES
  let uniqueArray;
  if (currentPage === 1) {uniqueArray = unfiltArray.slice(0, recordPerPage)}
  else if (props.refilter === "yes") {uniqueArray = unfiltArray.slice(0, recordPerPage)}
  else {
    let start = (currentPage - 1) * recordPerPage
    let end = currentPage * recordPerPage
    uniqueArray = unfiltArray.slice(start, end)
  };

  //CONSTRUCT SEARCH BAR
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
          <Button
            variant="danger"
            id="basic-search"
            aria-label="basic-search-submit"
            onClick={(value) => {props.fetchSearch(value); setCurrentPage(1)}}>
            <FaSearch />
          </Button>
      </InputGroup>
    </Col></Row>
  )}

  //MAPS RESULTS TO TEMPLATE
  function displayMapper(props, array) {
    const disp = array.map((node, index) => {
      //SET NAME FOR RELATIONSHIP
      let otherVal;
      if (node.other.family_name_western) {
        if ((props.language === "zh" || props.language === "tw") && node.other.chinese_given_name_hanzi) {otherVal = `${node.other.chinese_family_name_hanzi} ${node.other.chinese_given_name_hanzi}`}
        else {otherVal = `${node.other.given_name_western} ${node.other.family_name_western}`}
      }
      else {
        if ((props.language === "zh" || props.language === "tw") && node.other.chinese_name_hanzi) {otherVal = node.other.chinese_name_hanzi}
        else {otherVal = node.other.name_western}
      }
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
        if (altVal.length > 0) {altDisp = altVal+" | "}
      //SET NAME
      let nameVal;
      if (node.label === "Person") {
        if ((props.language == "zh" || props.language == "tw") && node.properties.chinese_given_name_hanzi) {nameVal = `${node.properties.chinese_family_name_hanzi} ${node.properties.chinese_given_name_hanzi}`}
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
      else if (node.label === "Event") {typeVal = translate[0][node.label.toLowerCase()][props.language]; typeStyle = "d-inline-block font-weight-bold mt-1 p-2 badge bg-warning"}
      else if (node.label === "Publication") {typeVal = translate[0][node.label.toLowerCase()][props.language]; typeStyle = "d-inline-block font-weight-bold mt-1 p-2 badge bg-black"};

      let rel;
        if (node.rel) { rel = node.rel }
        else {rel = "N/A"}

      function capitilizeFirst(str) {
        let capitalizedString = str.toString().substr(0, 1).toUpperCase();
        capitalizedString += str.replace(str.substr(0, 1), "");
        return capitalizedString;
        }

      let relcheck;
        if (relationships[0][rel.replace(/\s+$/, '').replace(/\s|\//g, '_').toLowerCase()] === undefined && rel !== null) {relcheck = capitilizeFirst(rel)}
        else {relcheck = relationships[0][rel.replace(/\s+$/, '').replace(/\s|\//g, '_').toLowerCase()][props.language]}

      return (
      <li className="list-group-item pt-1 pb-1"><div className="card-body px-1 p-1"><Row>
        <Col className="col-7">
          <Row><Col className="text-start">
            <span className="popup_link" data-prop="popupcontainer" onClick={() => props.selectSwitchInitial((node.key))}>{nameVal}</span>
            </Col></Row>
          <Row><Col className="card_sources lh-1 pt-1">{altDisp} {relcheck} - {otherVal}</Col></Row>
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

  let containerCheck;
    if (props.filterDisplay == "filter_container") {containerCheck = "list_float"}
    else {containerCheck = "list_float_full"};

// RETURNS ////////////////////////////////////////////////////////////////////////////////////////

  // LOADING STATE RETURN
  if (props.content === "loading") { return (
    <div className="list_container">
      <div className={containerCheck + " d-flex align-items-center justify-content-center"}>
        <Row><Col>
        <Spinner animation="border" role="status" variant="light"><span className="visually-hidden hide">Loading...</span></Spinner>
        </Col></Row>
      </div>
    </div>
   )}

  // PLACHOLDER RETURN
  else if (props.nodeArray.length === 0) { return (
    <div className="list_container" >
      <div className={containerCheck + " d-flex flex-column"} id="main">
          <h1 className="aria-only">{translate[0]["search"][props.language]}</h1>
          {searchField(props)}
          <Row className="m-auto p-2"><Col className="">
            <div className="list_placeholder"> </div>
          </Col></Row>
      </div>
    </div>
  )}

  // SEARCH RESULT RETURN
  else { return (
    <div className="list_container">
      <div className={containerCheck} id="main">
      <h1 className="aria-only">{translate[0]["search"][props.language]}</h1>
      {searchField(props)}
        <Row>
          <Col className="mb-2 mt-3 text-light"><span>{translate[0]["results_for"][props.language]} "{props.searchSet}"</span></Col>
        </Row>
        <div className="card">
          <ul className="list-group list-group-flush">
          {displayMapper(props, uniqueArray)}
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

/////////////////////////////////////////////////////////////////////////////////////////////////////
// EXPORT //////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

export default SearchResults
