// IMPORTS ////////////////////////////////////////////////////////////////////

// MAIN DEPENDENCIES
import React from 'react'
import {Card, Spinner} from 'react-bootstrap';
import translate from "../../../Assets/indexes/translate.json";



// FUNCTIONAL COMPONENT ////////////////////////////////////////////////////////

function TotalCount(props) {

  // RETURNS PLACEHOLDER
  return (
    <Card className="m-2">
      <Card.Body>
        <Card.Text className="text-center text-uppercase mb-0" style={{fontSize: '.8rem'}}>{translate[0]["total"][props.language]} {props.type}</Card.Text>
        <Card.Title className="text-center fw-bolder fs-3">
          { props.queryResult
            ? props.queryResult
            : <Spinner animation="border" role="status" variant="danger"><span className="visually-hidden">Loading...</span></Spinner>
          }
        </Card.Title>
      </Card.Body>
    </Card>
  )

}

export default TotalCount
