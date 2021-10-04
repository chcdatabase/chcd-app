import { BsX } from 'react-icons/bs'
import { Row, Col, Button } from 'react-bootstrap';

function NoResults(props) {

  return (
    <div className={props.noresults} >
      <div className="results_message">
      <BsX className="results_close m-2" data-prop="noresults" onClick={(i) =>  props.toggleDisplay(i)}/>
        <Row className="mt-3">
          <Col className="m-2 y-auto">
            <h3>Sorry!</h3>
            This query produced no results. Try to broaden the scope of your search or filter.
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default NoResults
