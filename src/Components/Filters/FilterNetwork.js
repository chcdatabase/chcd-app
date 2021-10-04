import React from 'react'
import { Row, Col, Form, Button } from 'react-bootstrap';
import { BsFillCaretLeftFill } from 'react-icons/bs';
import Select from 'react-select'

function FilterNetwork(props) {

 return (
   <div className="filter_area">
     <div className={props.filterDisplay}>
     <div className="filter_header">Network Parameters</div>
     <Form>

     <Row className="mb-2">
     <Col>
       <Form.Group>
         <Row><Col>
           <Form.Label className="filter_label mb-0">Start Year</Form.Label>
           <Form.Control type="text" name="start_year" value={props.start_year} onChange={(i) =>  props.handleChange(i)}/>
         </Col></Row>
       </Form.Group>
     </Col>
       <Col>
         <Form.Group>
           <Row><Col>
             <Form.Label className="filter_label mb-0">End Year</Form.Label>
             <Form.Control type="text" name="end_year" value={props.end_year} onChange={(i) =>  props.handleChange(i)}/>
           </Col></Row>
         </Form.Group>
       </Col>
     </Row>

       <Form.Group className="mb-2"><Row><Col>
           <Row><Col><Form.Label className="filter_label mb-0">Person</Form.Label></Col></Row>
           <Row><Col>
           <Select
           options={props.netPersonIndex}
           value={props.netPersonIndex.value}
           onChange={(option) =>  props.handleChangeData(option)}
           />
             </Col></Row>
       </Col></Row></Form.Group>

       <Form.Group className="mb-2">
         <Row><Col>
           <Form.Label className="filter_label mb-0">Degrees of Connection</Form.Label>
           <Form.Select className="g-2" name="degree" value={props.degree} onChange={(i) =>  props.handleChange(i)}>
             <option value="1">1</option>
             <option value="2">2</option>
             <option value="3">3</option>
           </Form.Select>
         </Col></Row>
       </Form.Group>

      <Form.Group className="mb-2">
        <Row><Col>
        <Form.Label className="filter_label mb-0">Include Entities</Form.Label>
          <div key="default-checkbox1" className="mb-1">
            <Form.Check type="checkbox"
              name="people_include"
              label="Include People"
              checked={props.people_include}
              onChange={(checked) =>  props.handleCheck(checked)}
            />
          </div>
          <div key="default-checkbox2" className="mb-1">
            <Form.Check type="checkbox"
              name="inst_include"
              label="Include Institutions"
              checked={props.inst_include}
              onChange={(checked) =>  props.handleCheck(checked)}
            />
          </div>
          <div key="default-checkbox3" className="mb-1">
            <Form.Check type="checkbox"
              name="corp_include"
              label="Include Corporate Entities"
              checked={props.corp_include}
              onChange={(checked) =>  props.handleCheck(checked)}
            />
          </div>
          <div key="default-checkbox4" className="mb-1">
            <Form.Check type="checkbox"
              name="event_include"
              label="Include Events"
              checked={props.event_include}
              onChange={(checked) =>  props.handleCheck(checked)}
            />
          </div>
        </Col></Row>
      </Form.Group>
     <br />
     </Form>

     <Row className="mb-2">
       <Col>
         <Button className="mb-2 col-12" variant="danger" onClick={() =>  props.fetchNetworkResults()}>Submit</Button>
       </Col>
       <Col>
         <Button className="mb-2 col-12" variant="outline-danger" onClick={() => window.location.reload(false)}>Reset</Button>
       </Col>
     </Row>

     <div className="filter_button_container">
       <div onClick={() =>  props.filterHide()} className="filter_button">
         <BsFillCaretLeftFill />
       </div>
     </div>
     </div>

   </div>
 )
}

export default FilterNetwork
