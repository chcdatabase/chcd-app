import React from 'react'
import { Row, Col, Form, Button } from 'react-bootstrap';
import { BsFillCaretLeftFill } from 'react-icons/bs'
import Select from 'react-select'
import locations from "../../Assets/indexes/location-index.json"

function FilterMap(props) {

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

// PEOPLE FORM //////////////////////////////////////////////////////////
  if (props.kind === "People"){
    return (
      <div className="filter_area">
      <div className={props.filterDisplay}>
        <div className="filter_header">Map Filters</div>
        <Form>
        {/* FORM SELEECT ------------------------------------ */}
        <Form.Group className="mb-2"><Row><Col>
            <Form.Label className="filter_label mb-0">Type</Form.Label>
            <Form.Select className="g-2" name="kind" value={props.kind} onChange={(value) =>  props.handleFormChange(value)}>
              <option value="People">People</option>
              <option value="Institutions">Institutions</option>
            </Form.Select>
        </Col></Row></Form.Group>
        {/* TIME SELECT ------------------------------------ */}
        <Row className="mb-2">
           <Col><Form.Group><Row><Col>
              <Form.Label className="filter_label mb-0">Start Year</Form.Label>
              <Form.Control type="text" name="start_year" value={props.start_year} onChange={(value) =>  props.handleChange(value)}/>
            </Col></Row></Form.Group></Col>
            <Col><Form.Group><Row><Col>
              <Form.Label className="filter_label mb-0">End Year</Form.Label>
              <Form.Control type="text" name="end_year" value={props.end_year} onChange={(value) =>  props.handleChange(value)}/>
            </Col></Row></Form.Group></Col>
          </Row>
        {/* PLACE SELECT ------------------------------------ */}
        <Form.Group className="mb-2"><Row><Col>
            <Form.Label className="filter_label mb-0">Location</Form.Label>
            <Form.Select className="g-2" name="location" value={props.location} onChange={(value) =>  props.handleChange(value)}>
              {locationList.map(node => (<option value={node.name_zh}>{node.name_wes} ({node.name_zh})</option>))}
            </Form.Select>
        </Col></Row></Form.Group>
        {/* FAMILY NAME SELECT ------------------------------------ */}
        <Form.Group className="mb-2"><Row><Col>
          <Form.Label className="filter_label mb-0">Family Name</Form.Label>
          <Form.Control type="text" name="family_name_western" value={props.family_name_western} onChange={(value) =>  props.handleChange(value)}/>
        </Col></Row></Form.Group>
        {/* GIVEN NAME SELECT ------------------------------------ */}
        <Form.Group className="mb-2"><Row><Col>
            <Form.Label className="filter_label mb-0">Given Name</Form.Label>
            <Form.Control type="text" name="given_name_western" value={props.given_name_western} onChange={(value) =>  props.handleChange(value)}/>
        </Col></Row></Form.Group>
        {/* PERS AFF SELECT ------------------------------------ */}
        <Form.Group className="mb-2"><Row><Col>
            <Form.Label className="filter_label mb-0">Affiliation</Form.Label>
            <Form.Select className="g-2" name="affiliation" value={props.affiliation} onChange={(value) =>  props.handleChange(value)}>
              {props.pAffIndex.map(node => (<option value={node.value}>{node.value}</option>))}
            </Form.Select>
        </Col></Row></Form.Group>
        {/* NATIONALITY SELECT ------------------------------------ */}
        <Form.Group className="mb-2"><Row><Col>
            <Form.Label className="filter_label mb-0">Nationality</Form.Label>
            <Form.Select className="g-2" name="nationality" value={props.nationality} onChange={(value) =>  props.handleChange(value)}>
              {props.natIndex.map(node => (<option value={node.value}>{node.value}</option>))}
            </Form.Select>
        </Col></Row></Form.Group>
        {/* GENDER SELECT ------------------------------------ */}
        <Form.Group className="mb-2"><Row><Col>
            <Form.Label className="filter_label mb-0">Gender</Form.Label>
            <Form.Select className="g-2" name="gender" value={props.gender} onChange={(value) =>  props.handleChange(value)}>
              <option value="All">All</option>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
            </Form.Select>
          </Col></Row></Form.Group>
        </Form>
        {/* BUTTONS SELECT ------------------------------------ */}
        <Row className="mb-2">
           <Col><Button className="mb-2 col-12" variant="danger" onClick={() =>  props.fetchResults()}>Submit</Button></Col>
           <Col><Button className="mb-2 col-12" variant="outline-danger" onClick={() =>  props.resetFilter()}>Clear All</Button></Col>
        </Row>
        {/* FILTER TOGGLE SELECT ------------------------------------ */}
        <div className="filter_button_container">
          <div onClick={() =>  props.filterHide()} className="filter_button">
            <BsFillCaretLeftFill />
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
          <div className="filter_header">Search & Filter</div>
          <Form>
          {/* FORM SELEECT ------------------------------------ */}
          <Form.Group className="mb-2"><Row><Col>
              <Form.Label className="filter_label mb-0">Type</Form.Label>
              <Form.Select className="g-2" name="kind" value={props.kind} onChange={(value) =>  props.handleFormChange(value)}>
                <option value="People">People</option>
                <option value="Institutions">Institutions</option>
              </Form.Select>
          </Col></Row></Form.Group>
          {/* TIME SELECT ------------------------------------ */}
          <Row className="mb-2">
             <Col><Form.Group><Row><Col>
                <Form.Label className="filter_label mb-0">Start Year</Form.Label>
                <Form.Control type="text" name="start_year" value={props.start_year} onChange={(value) =>  props.handleChange(value)}/>
              </Col></Row></Form.Group></Col>
              <Col><Form.Group><Row><Col>
                <Form.Label className="filter_label mb-0">End Year</Form.Label>
                <Form.Control type="text" name="end_year" value={props.end_year} onChange={(value) =>  props.handleChange(value)}/>
              </Col></Row></Form.Group></Col>
            </Row>
          {/* PLACE SELECT ------------------------------------ */}
          <Form.Group className="mb-2"><Row><Col>
              <Form.Label className="filter_label mb-0">Location</Form.Label>
              <Form.Select className="g-2" name="location" value={props.location} onChange={(value) =>  props.handleChange(value)}>
                {locationList.map(node => (<option value={node.name_zh}>{node.name_wes} ({node.name_zh})</option>))}
              </Form.Select>
          </Col></Row></Form.Group>
          {/* NAME SELECT ------------------------------------ */}
          <Form.Group className="mb-2"><Row><Col>
            <Form.Label className="filter_label mb-0">Institution Name</Form.Label>
            <Form.Control type="text" name="name_western" value={props.name_western} onChange={(value) =>  props.handleChange(value)}/>
          </Col></Row></Form.Group>
          {/* INST AFF SELECT ------------------------------------ */}
          <Form.Group className="mb-2"><Row><Col>
            <Form.Label className="filter_label mb-0">Institutional Affiliation</Form.Label>
            <Form.Select className="g-2" name="affiliation" value={props.affiliation} onChange={(value) =>  props.handleChange(value)}>
              {props.affIndex.map(node => (<option value={node.value}>{node.value}</option>))}
            </Form.Select>
          </Col></Row></Form.Group>
          {/* RELIGIOUS FAMILY SELECT ------------------------------------ */}
          <Form.Group className="mb-2"><Row><Col>
              <Form.Label className="filter_label mb-0">Religious Family</Form.Label>
              <Form.Select className="g-2" name="religious_family" value={props.religious_family} onChange={(value) =>  props.handleChange(value)}>
                {props.relFamIndex.map(node => (<option value={node.value}>{node.value}</option>))}
              </Form.Select>
          </Col></Row></Form.Group>
          {/* CATEGORY SELECT ------------------------------------ */}
          <Form.Group className="mb-2"><Row><Col>
              <Form.Label className="filter_label mb-0">Category</Form.Label>
              <Form.Select className="g-2" name="institution_category" value={props.institution_category} onChange={(i) =>  props.handleChange(i)}>
                {props.instCatsIndex.map((node, i) => (<option data-index={i} value={node[0]}>{node[0]}</option>))}
              </Form.Select>

          </Col></Row></Form.Group>
          {/* SUBCATEGORY SELECT ------------------------------------ */}
          <Form.Group className="mb-2"><Row><Col>
              <Form.Label className="filter_label mb-0">Subcategory</Form.Label>
              <Form.Select className="g-2" name="institution_subcategory" value={props.institution_subcategory} onChange={(value) =>  props.handleChange(value)}>
                {subcat}
              </Form.Select>
          </Col></Row></Form.Group>
          </Form>
          {/* BUTTONS SELECT ------------------------------------ */}
          <Row className="mb-2">
             <Col><Button className="mb-2 col-12" variant="danger" onClick={() =>  props.fetchResults()}>Submit</Button></Col>
             <Col><Button className="mb-2 col-12" variant="outline-danger" onClick={() =>  props.resetFilter()}>Clear All</Button></Col>
          </Row>
          {/* FILTER TOGGLE SELECT ------------------------------------ */}
          <div className="filter_button_container">
            <div onClick={() =>  props.filterHide()} className="filter_button">
              <BsFillCaretLeftFill />
            </div>
          </div>
        </div>
        </div>
        )
    }
}


export default FilterMap
