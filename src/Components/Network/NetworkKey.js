/////////////////////////////////////////////////////////////////////////////////////////////////////
// IMPORTS //////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

import React from 'react'
import { Row, Col } from 'react-bootstrap';
import { GiPlainCircle, GiPlainSquare } from 'react-icons/gi'
import { IoTriangle } from 'react-icons/io5'
import { ImDiamonds, ImStarFull } from 'react-icons/im'
import { BsCircle, BsChevronDown, BsChevronUp } from 'react-icons/bs'
import translate from "../../Assets/indexes/translate.json"

/////////////////////////////////////////////////////////////////////////////////////////////////////
// COMPONENT ////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

function NetworkKey(props) {

// STYLE CONSTRUCTORS //////////////////////////////////////////////////////////////////////////////
  const keyStyle = {
    fontSize: '.75em',
    color: 'white',
    position: 'absolute',
    right: '30px',
    minWidth: '150px',
    bottom: '20px',
    zIndex: '800'
  }

  const keyHead = {
    fontSize: '1.5em',
    float: 'right',
    marginBottom: '5px'
  }

// TOGGLE BUTTON CONSTRUCTOR\ //////////////////////////////////////////////////////////////////////
  function keyCheck(props) {
    if (props.keyBorder === "rounded") { return (
      <BsChevronUp
        size="1.5em"
        className="mt-1 network-key"
        onClick={() => props.hideKey()}
      />
    )}
    else { return (
      <BsChevronDown
        size="1.5em"
        className="mt-1"
        onClick={() => props.hideKey()}
      />
    )}
  }

// RETURN ///////////////////////////////////////////////////////////////////////////////////////
 return (
  <div>
    <div style={keyStyle}>
      <Row className="mb-0">
        <Col className="col-9 text-right"><h2 style={keyHead}>{translate[0]["key"][props.language]}</h2></Col>
        <Col className={props.keyBorder + " col-3 text-light w-25 text-center border border-white"}>
          {keyCheck(props)}
        </Col>
      </Row>
        <Row className={props.networkKey + " bg-dark py-3 px-2 border border-white rounded-right rounded-bottom"}>
        <Col >
          <div className="mb-2">
            <div><BsCircle color="white" /> {translate[0]["selected"][props.language]} {translate[0]["person"][props.language]}</div>
            <div><GiPlainCircle color="#5cbef2" /> {translate[0]["person"][props.language]} ({translate[0]["male"][props.language]})</div>
            <div><GiPlainCircle color="#f25c73" /> {translate[0]["person"][props.language]} ({translate[0]["female"][props.language]})</div>
            <div><GiPlainCircle color="#b18cf5" /> {translate[0]["person"][props.language]} ({translate[0]["unknown"][props.language]})</div>
          </div>
          <div className="mb-2">
            <div><GiPlainSquare color="#f2905c" /> {translate[0]["institution"][props.language]}</div>
            <div><IoTriangle color="#e8859b" /> {translate[0]["corporate_entity"][props.language]}</div>
            <div><ImDiamonds color="#bc0943" /> {translate[0]["event"][props.language]}</div>
            <div><ImStarFull color="#70bc76" /> {translate[0]["publication"][props.language]}</div>
          </div>
          <div>
            <div>&nbsp;<GiPlainCircle color="white"/>&nbsp;&nbsp;{translate[0]["fewer_connections"][props.language]}</div>
            <div><GiPlainCircle color="white" size="1.5em"/> {translate[0]["more_connections"][props.language]}</div>
          </div>
        </Col>
      </Row>
    </div>
  </div>
 )
}

/////////////////////////////////////////////////////////////////////////////////////////////////////
// EXPORT //////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

export default NetworkKey
