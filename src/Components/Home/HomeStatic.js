// IMPORTS ////////////////////////////////////////////////////////////////////

// MAIN DEPENDENCIES
import React from 'react'
import { Row, Col, Spinner, Card } from 'react-bootstrap';
import { HiDocumentText } from 'react-icons/hi'
import { MdCloudDownload } from 'react-icons/md'
import { FaReadme } from 'react-icons/fa'



import translate from "../../Assets/indexes/translate.json"
import nationality from "../../Assets/indexes/nationality.json"
import family_trans from "../../Assets/indexes/religious_family.json"
import cat_trans from "../../Assets/indexes/categories.json"



// FUNCTIONAL COMPONENT ////////////////////////////////////////////////////////

function HomeStatic(props) {

  const headline = {
    fontFamily: "'Baloo Tamma 2', sans-serif",
    fontSize: '4rem',
    lineHeight: '3.5rem',
    fontWeight: '600',
    textTransform: 'uppercase'
  }

  const fullHeight = { height: 'calc(100vh - 80px)' }

  const cardStyle = "home_card d-flex align-items-center mb-4 text-uppercase fs-6 bg-transparent rounded-pill"

  // RETURNS PLACEHOLDER
  return (
    <div className="container-md px-5" tabindex="-1" id="main">
        <Row className="d-flex align-items-center pt-4" style={fullHeight}>
          <Col lg={8}>
            <h1 style={headline} className="mb-4">{translate[0]["home_headline"][props.language]}</h1>
            <p>{translate[0]["home_subheadline"][props.language]}</p>
          </Col>
          <Col lg={4}>
            <a href="https://chcdatabase.com/" target="_blank">
              <Card className={cardStyle}><Card.Body>
                <div className="float-start"><FaReadme size='2em' /></div>
                <div className="float-start ms-2 pt-1" >{translate[0]["about_the_project"][props.language]}</div>
              </Card.Body></Card>
            </a>
            <a href="https://chcdatabase.github.io/data-collection/" target="_blank">
              <Card className={cardStyle}><Card.Body>
                <div className="float-start"><HiDocumentText size='2em' /></div>
                <div className="float-start ms-2 pt-1" >{translate[0]["documentation"][props.language]}</div>
              </Card.Body></Card>
            </a>
            <a href="https://github.com/chcdatabase/data-collection/" target="_blank">
              <Card className={cardStyle}><Card.Body>
                <div className="float-start"><MdCloudDownload size='2em' /></div>
                <div className="float-start ms-2 pt-1" >{translate[0]["download_data"][props.language]}</div>
              </Card.Body></Card>
            </a>
          </Col>
        </Row>
      </div>
  )

}

export default HomeStatic
