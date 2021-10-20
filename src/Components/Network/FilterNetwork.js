import React from 'react'
import { Row, Col, Form, Button } from 'react-bootstrap';
import { BsFilterLeft } from 'react-icons/bs'
import Select from 'react-select'

import translate from "../../Assets/indexes/translate.json"
import nationality from "../../Assets/indexes/nationality.json"
import family_trans from "../../Assets/indexes/religious_family.json"
import cat_trans from "../../Assets/indexes/categories.json"

function FilterNetwork(props) {

 return (
   <div className="filter_area">
     <div className={props.filterDisplay}>
     <div className="filter_header">{translate[0]["network-parameters"][props.language]}</div>
     <div className="filter_scroll_area mb-4">
     <Form>

     <Row className="mb-1">
     <Col>
       <Form.Group>
         <Row><Col>
           <Form.Label className="filter_label mb-0">{translate[0]["start_year"][props.language]}</Form.Label>
           <Form.Control type="text" name="start_year" value={props.start_year} onChange={(i) =>  props.handleChange(i)}/>
         </Col></Row>
       </Form.Group>
     </Col>
       <Col>
         <Form.Group>
           <Row><Col>
             <Form.Label className="filter_label mb-0">{translate[0]["end_year"][props.language]}</Form.Label>
             <Form.Control type="text" name="end_year" value={props.end_year} onChange={(i) =>  props.handleChange(i)}/>
           </Col></Row>
         </Form.Group>
       </Col>
     </Row>

       <Form.Group className="mb-1"><Row><Col>
           <Row><Col><Form.Label className="filter_label mb-0">{translate[0]["node"][props.language]}</Form.Label></Col></Row>
           <Row><Col>
           <Select
           options={props.netPersonIndex}
           value={props.netPersonIndex.value}
           onChange={(option) =>  props.handleChangeData(option)}
           />
             </Col></Row>
       </Col></Row></Form.Group>

       <Form.Group className="mb-1">
         <Row><Col>
           <Form.Label className="filter_label mb-0">{translate[0]["degrees_of_connection"][props.language]}</Form.Label>
           <Form.Select className="g-2" name="degree" value={props.degree} onChange={(i) =>  props.handleChange(i)}>
             <option value="1">1</option>
             <option value="2">2</option>
             <option value="3">3</option>
           </Form.Select>
         </Col></Row>
       </Form.Group>

      <Form.Group className="mb-1">
        <Row><Col>
        <Form.Label className="filter_label mb-0">{translate[0]["include"][props.language]} {translate[0]["nodes"][props.language]}</Form.Label>
          <div key="default-checkbox1" className="mb-1">
            <Form.Check type="checkbox"
              name="people_include"
              label={translate[0]["people"][props.language]}
              checked={props.people_include}
              onChange={(checked) =>  props.handleCheck(checked)}
            />
          </div>
          <div key="default-checkbox2" className="mb-1">
            <Form.Check type="checkbox"
              name="inst_include"
              label={translate[0]["institutions"][props.language]}
              checked={props.inst_include}
              onChange={(checked) =>  props.handleCheck(checked)}
            />
          </div>
          <div key="default-checkbox3" className="mb-1">
            <Form.Check type="checkbox"
              name="corp_include"
              label={translate[0]["corporate_entities"][props.language]}
              checked={props.corp_include}
              onChange={(checked) =>  props.handleCheck(checked)}
            />
          </div>
          <div key="default-checkbox4" className="mb-1">
            <Form.Check type="checkbox"
              name="event_include"
              label={translate[0]["events"][props.language]}
              checked={props.event_include}
              onChange={(checked) =>  props.handleCheck(checked)}
            />
          </div>
        </Col></Row>
      </Form.Group>
     <br />
     </Form>
     </div>
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
     <div className="filter_button_container">
       <div onClick={() =>  props.filterHide()} className="filter_button">
         <BsFilterLeft />
       </div>
     </div>
     </div>

   </div>
 )
}

export default FilterNetwork
