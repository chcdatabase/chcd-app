import React from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { BsFilterLeft } from 'react-icons/bs';
import Select from 'react-select';

function NavigationDataViews(props) {
    let generaViewlLink = window.location.pathname == "/data" ?
        <Link to={{pathname:"/data"}}><Button variant="danger" className="me-2">General</Button></Link> :
        <Link to={{pathname:"/data"}}><Button variant="outline-danger" className="me-2">General</Button></Link>;

    let corporateEntityViewlLink = window.location.pathname == "/data-corporate-entity" ?
        <Link to={{pathname:"/data-corporate-entity"}}><Button className="me-2" variant="danger">Corporate Entity</Button></Link> :
        <Link to={{pathname:"/data-corporate-entity"}}><Button className="me-2" variant="outline-danger">Corporate Entity</Button></Link>;

    let institutionViewLink = window.location.pathname == "/data-institution-view" ?
        <Link to={{pathname:"/data-institution-view"}}><Button className="me-2" variant="danger">Institution View</Button></Link> :
        <Link to={{pathname:"/data-institution-view"}}><Button className="me-2" variant="outline-danger">Institution View</Button></Link>;

    let geographicViewLink = window.location.pathname == "/data-geographic-view" ?
        <Link to={{pathname:"/data-geographic-view"}}><Button className="me-2" variant="danger">Geographic View</Button></Link> :
        <Link to={{pathname:"/data-geographic-view"}}><Button className="me-2" variant="outline-danger">Geographic View</Button></Link>;

    return (
        <div className="d-flex justify-content-center my-4">
            {/* {generaViewlLink}
            {corporateEntityViewlLink}
            {institutionViewLink}
            {geographicViewLink} */}
        </div>
    );
}

export default NavigationDataViews
