/////////////////////////////////////////////////////////////////////////////////////////////////////
// IMPORTS //////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

import React from 'react'
import { Row, Col, Form, Button } from 'react-bootstrap'
import { BsFilterLeft } from 'react-icons/bs'
import Select from 'react-select'
import ReactTooltip from "react-tooltip"
import translate from "../../Assets/indexes/translate.json"
import nationality from "../../Assets/indexes/nationality.json"
import family_trans from "../../Assets/indexes/religious_family.json"
import cat_trans from "../../Assets/indexes/categories.json"

/////////////////////////////////////////////////////////////////////////////////////////////////////
// COMPONENT ////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

function FilterNetwork(props) {

//PREPARE DATA
const nodeData = props.netPersonIndex.map(i => ({ label: i.label, value: i.value, type: "node_id" }));

 return (
   <div className="filter_area">
     <div className={props.filterDisplay}>
     <div className="filter_header">{translate[0]["network-parameters"][props.language]}</div>
     <div className="filter_scroll_area mb-4">
       <Form>

{/* TIME FILTERs //////////////////////////////////////////////////////////////////////////////////////////////// */}
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
                 />
               </Col></Row>
             </Form.Group>
           </Col>
         </Row>

{/* SELECT NODE FILTER ////////////////////////////////////////////////////////////////////////////////////////// */}
         <Form.Group className="mb-1"><Row><Col>
             <Row><Col><Form.Label className="filter_label mb-0" data-tip data-for="node">{translate[0]["node"][props.language]}</Form.Label></Col></Row>
                <ReactTooltip id="node" place="right" effect="solid">{translate[0]["type_to_select"][props.language]}</ReactTooltip>
             <Row><Col>
               <Select
                 aria-label={translate[0]["node"][props.language]}
                 options={nodeData}
                 value={nodeData.value}
                 onChange={(option) =>  props.handleChangeData(option)}
               />
             </Col></Row>
         </Col></Row></Form.Group>

{/* DEGREE FILTER /////////////////////////////////////////////////////////////////////////////////////////////// */}
         <Form.Group className="mb-1">
           <Row><Col>
             <Form.Label className="filter_label mb-0" data-tip data-for="degree">{translate[0]["degrees_of_connection"][props.language]}</Form.Label>
                <ReactTooltip id="degree" place="right" effect="solid">{translate[0]["degree"][props.language]}</ReactTooltip>
             <Form.Select className="g-2" name="degree" aria-label={translate[0]["degrees_of_connection"][props.language]} value={props.degree} onChange={(i) =>  props.handleChange(i)}>
               <option value="1">1</option>
               <option value="2">2</option>
               <option value="3">3</option>
             </Form.Select>
           </Col></Row>
         </Form.Group>

{/* NODE TYPE INCLUDED FILTER /////////////////////////////////////////////////////////////////////////////////// */}
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

       </Form>
     </div>

{/* SUBMIT & RESET BUTTON /////////////////////////////////////////////////////////////////////////////////// */}
     <div classname="filter-buttons">
       <Row className="mb-1">
         <Col>
           <Button className="mb-1 col-12" variant="danger" onClick={() =>  props.fetchNetworkResults()}>{translate[0]["submit"][props.language]}</Button>
         </Col>
         <Col>
           <Button className="mb-1 col-12" variant="outline-danger" onClick={() => window.location.reload(false)}>{translate[0]["reset"][props.language]}</Button>
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

/////////////////////////////////////////////////////////////////////////////////////////////////////
// EXPORT //////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

export default FilterNetwork
