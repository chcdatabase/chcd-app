import React from 'react'
import { Row, Col, Form, Button } from 'react-bootstrap';
import { BsFilterLeft } from 'react-icons/bs'
import Select from 'react-select'

function FilterData(props) {

 return (
   <div className="filter_area">
     <div className={props.filterDisplay}>
     <div className="filter_header">Data Parameters</div>
     <div className="filter_scroll_area mb-4">
     <Form>
     <Row className="mb-2">
     <Col>
       <Form.Group>
         <Row><Col>
           {/* <Form.Label className="filter_label mb-0">Start Year</Form.Label> */}
           {/* <Form.Control type="text" name="start_time" value={props.start_time} onChange={(i) =>  props.handleChange(i)}/> */}
         </Col></Row>
       </Form.Group>
     </Col>
       <Col>
         <Form.Group>
           <Row><Col>
             {/* <Form.Label className="filter_label mb-0">End Year</Form.Label> */}
             {/* <Form.Control type="text" name="end_time" value={props.end_time} onChange={(i) =>  props.handleChange(i)}/> */}
           </Col></Row>
         </Form.Group>
       </Col>
     </Row>

       <Form.Group className="mb-2"><Row><Col>
           { <Row><Col><Form.Label className="filter_label mb-0">Corporate Entity</Form.Label></Col></Row>}
           <Row><Col>
           {<Form.Select size="sm">
            {
              Array.from(props.corporateEntitiesWesternNames).map((item) => {
                return[
                  <option>{item}</option>
                ]
              })}
            </Form.Select>}
             </Col></Row>
       </Col></Row></Form.Group>

     <br />
     </Form>
     </div>
     <div classname="filter-buttons">
     <Row className="mb-2">
       <Col>
         <Button className="mb-2 col-12" variant="danger" onClick={() =>  props.fetchDataResults()}>Submit</Button>
       </Col>
       <Col>
         <Button className="mb-2 col-12" variant="outline-danger" onClick={() => window.location.reload(false)}>Reset</Button>
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

export default FilterData
