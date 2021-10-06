import { BsX } from 'react-icons/bs'
import { Row, Col, Button } from 'react-bootstrap';

function NoSend(props) {

  return (
    <div className={props.nosend} >
      <div className="results_message">
      <BsX className="results_close m-2" data-prop="nosend" onClick={(i) =>  props.toggleDisplay(i)}/>
        <Row className="mt-3">
          <Col className="m-2 y-auto">
            <h3>Sorry!</h3>
            This query is too broad. Use the filters to get results.
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default NoSend
