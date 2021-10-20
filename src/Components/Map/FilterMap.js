import React from 'react'
import { Row, Col, Form, Button } from 'react-bootstrap';
import { BsFilterLeft } from 'react-icons/bs'
import Select from 'react-select'

import locations from "../../Assets/indexes/location-index.json"
import translate from "../../Assets/indexes/translate.json"
import nationality from "../../Assets/indexes/nationality.json"
import family_trans from "../../Assets/indexes/religious_family.json"
import cat_trans from "../../Assets/indexes/categories.json"

function FilterMap(props) {

  let data = props.instCatsIndex
  let subcat = []
  for (let i = 0; i < data.length; i++) {
    if (data[i][0] === props.institution_category){
      let data2 = data[i][1]
      for (let t = 0; t < data2.length; t++) {
        let i = data2[t];
        subcat.push(<option value={i}>{cat_trans[0][i.replace(/\s|\//g, '_').toLowerCase()][props.language]}</option>)
      }
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

// PEOPLE FORM //////////////////////////////////////////////////////////
  if (props.kind === "People"){
    return (
      <div className="filter_area">
      <div className={props.filterDisplay}>
        <div className="filter_header">{translate[0]["map-filters"][props.language]}</div>
        <div className="filter_scroll_area mb-4">
        <Form>
        {/* FORM SELEECT ------------------------------------ */}
        <Form.Group className="mb-1"><Row><Col>
            <Form.Label className="filter_label mb-0">{translate[0]["type"][props.language]}</Form.Label>
            <Form.Select name="kind" value={props.kind} onChange={(value) =>  props.handleFormChange(value)}>
              <option value="People">{translate[0]["people"][props.language]}</option>
              <option value="Institutions">{translate[0]["institutions"][props.language]}</option>
            </Form.Select>
        </Col></Row></Form.Group>
        {/* TIME SELECT ------------------------------------ */}
        <Row className="mb-1">
           <Col><Form.Group><Row><Col>
              <Form.Label className="filter_label mb-0">{translate[0]["start_year"][props.language]}</Form.Label>
              <Form.Control type="text" name="start_year" value={props.start_year} onChange={(value) =>  props.handleChange(value)}/>
            </Col></Row></Form.Group></Col>
            <Col><Form.Group><Row><Col>
              <Form.Label className="filter_label mb-0">{translate[0]["end_year"][props.language]}</Form.Label>
              <Form.Control type="text" name="end_year" value={props.end_year} onChange={(value) =>  props.handleChange(value)}/>
            </Col></Row></Form.Group></Col>
          </Row>
        {/* NAME SELECT ------------------------------------ */}
        <Row className="mb-1">
          <Col><Form.Group><Row><Col>
            <Form.Label className="filter_label mb-0">{translate[0]["family_name"][props.language]}</Form.Label>
            <Form.Control type="text" name="family_name_western" value={props.family_name_western} onChange={(value) =>  props.handleChange(value)}/>
          </Col></Row></Form.Group></Col>
          <Col><Form.Group><Row><Col>
            <Form.Label className="filter_label mb-0">{translate[0]["given_name"][props.language]}</Form.Label>
            <Form.Control type="text" name="given_name_western" value={props.given_name_western} onChange={(value) =>  props.handleChange(value)}/>
          </Col></Row></Form.Group></Col>
        </Row>
        {/* PLACE SELECT ------------------------------------ */}
        <Form.Group className="mb-1"><Row><Col>
            <Form.Label className="filter_label mb-0">{translate[0]["location"][props.language]}</Form.Label>
            <Form.Select name="location" value={props.location} onChange={(value) =>  props.handleChange(value)}>
              {locationList.map(node => {
                if (props.language == "zh" || props.language == "tw") {
                  return (<option value={node.name_zh}>{node.name_zh}</option>)
                }
                else { return (<option value={node.name_zh}>{node.name_wes} ({node.name_zh})</option>)
                }
              })}
            </Form.Select>
        </Col></Row></Form.Group>
        {/* PERS AFF SELECT ------------------------------------ */}
        <Form.Group className="mb-1"><Row><Col>
            <Form.Label className="filter_label mb-0">{translate[0]["affiliation"][props.language]}</Form.Label>
            <Form.Select name="affiliation" value={props.affiliation} onChange={(value) =>  props.handleChange(value)}>
            {props.pAffIndex.map(node => {
              if ((props.language == "zh" || props.language == "tw") && node.zh) {
                return (<option value={node.zh}>{node.zh}</option>)
              }
              if ((props.language == "zh" || props.language == "tw") && node.value == "All") {
                return (<option value={node.value}>{translate[0]["all"][props.language]}</option>)
              }
              else {
                return (<option value={node.value}>{node.value}</option>)
              }
            })}
            </Form.Select>
        </Col></Row></Form.Group>
        {/* NATIONALITY SELECT ------------------------------------ */}
        <Form.Group className="mb-1"><Row><Col>
            <Form.Label className="filter_label mb-0">{translate[0]["nationality"][props.language]}</Form.Label>
            <Form.Select name="nationality" value={props.nationality} onChange={(value) =>  props.handleChange(value)}>
              {props.natIndex.map(node => (<option value={node.value}>{nationality[0][node.value.replace(/\s|\//g, '_').toLowerCase()][props.language]}</option>))}
            </Form.Select>
        </Col></Row></Form.Group>
        {/* GENDER SELECT ------------------------------------ */}
        <Form.Group className="mb-1"><Row><Col>
            <Form.Label className="filter_label mb-0">{translate[0]["gender"][props.language]}</Form.Label>
            <Form.Select name="gender" value={props.gender} onChange={(value) =>  props.handleChange(value)}>
              <option value="All">{translate[0]["all"][props.language]}</option>
              <option value="Female">{translate[0]["female"][props.language]}</option>
              <option value="Male">{translate[0]["male"][props.language]}</option>
            </Form.Select>
          </Col></Row></Form.Group>
        </Form>
        </div>
        {/* BUTTONS SELECT ------------------------------------ */}
        <div classname="filter-buttons">
          <Row className="mb-1">
             <Col><Button className="mb-1 col-12" variant="danger" onClick={() =>  props.fetchResults()}>{translate[0]["submit"][props.language]}</Button></Col>
             <Col><Button className="mb-1 col-12" variant="outline-danger" onClick={() =>  props.resetFilter()}>{translate[0]["clear-all"][props.language]}</Button></Col>
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

// INSTITUTION FORM //////////////////////////////////////////////////////////
  else if (props.kind === "Institutions"){
      return (
        <div className="filter_area">
        <div className={props.filterDisplay}>
          <div className="filter_header">{translate[0]["map-filters"][props.language]}</div>
          <div className="filter_scroll_area mb-4">
          <Form>
          {/* FORM SELEECT ------------------------------------ */}
          <Form.Group className="mb-1"><Row><Col>
              <Form.Label className="filter_label mb-0">{translate[0]["type"][props.language]}</Form.Label>
              <Form.Select name="kind" value={props.kind} onChange={(value) =>  props.handleFormChange(value)}>
              <option value="People">{translate[0]["people"][props.language]}</option>
              <option value="Institutions">{translate[0]["institutions"][props.language]}</option>
              </Form.Select>
          </Col></Row></Form.Group>
          {/* TIME SELECT ------------------------------------ */}
          <Row className="mb-1">
             <Col><Form.Group><Row><Col>
                <Form.Label className="filter_label mb-0">{translate[0]["start_year"][props.language]}</Form.Label>
                <Form.Control type="text" name="start_year" value={props.start_year} onChange={(value) =>  props.handleChange(value)}/>
              </Col></Row></Form.Group></Col>
              <Col><Form.Group><Row><Col>
                <Form.Label className="filter_label mb-0">{translate[0]["end_year"][props.language]}</Form.Label>
                <Form.Control type="text" name="end_year" value={props.end_year} onChange={(value) =>  props.handleChange(value)}/>
              </Col></Row></Form.Group></Col>
            </Row>
          {/* PLACE SELECT ------------------------------------ */}
          <Form.Group className="mb-1"><Row><Col>
              <Form.Label className="filter_label mb-0">{translate[0]["location"][props.language]}</Form.Label>
              <Form.Select name="location" value={props.location} onChange={(value) =>  props.handleChange(value)}>
                {locationList.map(node => (<option value={node.name_zh}>{node.name_wes} ({node.name_zh})</option>))}
              </Form.Select>
          </Col></Row></Form.Group>
          {/* NAME SELECT ------------------------------------ */}
          <Form.Group className="mb-1"><Row><Col>
            <Form.Label className="filter_label mb-0">{translate[0]["inst_name"][props.language]}</Form.Label>
            <Form.Control type="text" name="name_western" value={props.name_western} onChange={(value) =>  props.handleChange(value)}/>
          </Col></Row></Form.Group>
          {/* INST AFF SELECT ------------------------------------ */}
          <Form.Group className="mb-1"><Row><Col>
            <Form.Label className="filter_label mb-0">{translate[0]["inst_affiliation"][props.language]}</Form.Label>
            <Form.Select name="affiliation" value={props.affiliation} onChange={(value) =>  props.handleChange(value)}>
              {props.affIndex.map(node => {
                if ((props.language == "zh" || props.language == "tw") && node.zh) {
                  return (<option value={node.zh}>{node.zh}</option>)
                }
                if ((props.language == "zh" || props.language == "tw") && node.value == "All") {
                  return (<option value={node.value}>{translate[0]["all"][props.language]}</option>)
                }
                else {
                  return (<option value={node.value}>{node.value}</option>)
                }
              })}
            </Form.Select>
          </Col></Row></Form.Group>
          {/* RELIGIOUS FAMILY SELECT ------------------------------------ */}
          <Form.Group className="mb-1"><Row><Col>
              <Form.Label className="filter_label mb-0">{translate[0]["religious_family"][props.language]}</Form.Label>
              <Form.Select name="religious_family" value={props.religious_family} onChange={(value) =>  props.handleChange(value)}>
                {props.relFamIndex.map(node => {
                  if (family_trans[0][node.value.toLowerCase()][props.language] != undefined) { return (<option value={node.value}>{family_trans[0][node.value.toLowerCase()][props.language]}</option>)}
                  else { return (<option value={node.value}>{family_trans[0][node.value][props.language]}</option>)}
                })}
              </Form.Select>
          </Col></Row></Form.Group>
          {/* CATEGORY SELECT ------------------------------------ */}
          <Form.Group className="mb-1"><Row><Col>
              <Form.Label className="filter_label mb-0">{translate[0]["inst_category"][props.language]}</Form.Label>
              <Form.Select name="institution_category" value={props.institution_category} onChange={(i) =>  props.handleChange(i)}>
                {props.instCatsIndex.map((node, i) => {
                  let val = node[0];
                  return (<option data-index={i} value={val}>{cat_trans[0][val.replace(/\s|\//g, '_').toLowerCase()][props.language]}</option>)
                })}
              </Form.Select>

          </Col></Row></Form.Group>
          {/* SUBCATEGORY SELECT ------------------------------------ */}
          <Form.Group className="mb-1"><Row><Col>
              <Form.Label className="filter_label mb-0">{translate[0]["inst_subcategory"][props.language]}</Form.Label>
              <Form.Select name="institution_subcategory" value={props.institution_subcategory} onChange={(value) =>  props.handleChange(value)}>
                {subcat}
              </Form.Select>
          </Col></Row></Form.Group>
          </Form>
          </div>
          {/* BUTTONS SELECT ------------------------------------ */}
          <Row className="mb-1">
             <Col><Button className="mb-1 col-12" variant="danger" onClick={() =>  props.fetchResults()}>{translate[0]["submit"][props.language]}</Button></Col>
             <Col><Button className="mb-1 col-12" variant="outline-danger" onClick={() =>  props.resetFilter()}>{translate[0]["clear-all"][props.language]}</Button></Col>
          </Row>
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


export default FilterMap
