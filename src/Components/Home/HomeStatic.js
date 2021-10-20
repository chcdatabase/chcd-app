// IMPORTS ////////////////////////////////////////////////////////////////////

// MAIN DEPENDENCIES
import React from 'react'
import { Row, Col, Spinner } from 'react-bootstrap';

import translate from "../../Assets/indexes/translate.json"
import nationality from "../../Assets/indexes/nationality.json"
import family_trans from "../../Assets/indexes/religious_family.json"
import cat_trans from "../../Assets/indexes/categories.json"



// FUNCTIONAL COMPONENT ////////////////////////////////////////////////////////

function HomeStatic(props) {

  // RETURNS PLACEHOLDER
  return (
    <div className="container h-100">
      <div className="d-flex align-items-center justify-content-center">
        <Row>
        <Col className="col-1">
        </Col>
        <Col className="col-10">
          <h1>{translate[0].home[props.language]}</h1>
        </Col>
        <Col className="col-1">
        </Col>
        </Row>
      </div>
    </div>
  )

}

export default HomeStatic
