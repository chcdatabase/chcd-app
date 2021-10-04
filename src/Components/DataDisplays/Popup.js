import { BsX } from 'react-icons/bs'
import { Row, Col, Button } from 'react-bootstrap';

function Popup(props) {

//CONSTRUCT PERSONAL RELATIONSHIP ARRAY & OUTPUT
  const getPersRels = () => {
    const persRels = props.selectArray.filter(type => type.rel_kind === "Person")
    if (persRels.length > 0) {
      const persList = persRels.map(function(node) {
        if (node.rel.source) {
          return (
            <ul className="list-group list-group-flush">
              <li className="list-group-item pt-0 pb-0 border-bottom-0">
                <div className="card-body px-0 p-1">
                <Row>
                  <Col className="text-left"><span className="popup_link" onClick={() =>  props.selectSwitchAppend((node.key2))}>{node.node2.given_name_western} {node.node2.family_name_western}</span></Col>
                  <Col className="text-center">{node.rel.rel_type}</Col>
                  <Col className="text-end">{node.rel.start_year}-{node.rel.end_year}</Col>
                </Row>
                </div>
              </li>
              <li className="card_sources list-group-item px-3 py-0 mb-2"><span className="popup_card_header sources">SOURCES:</span> {node.rel.source}</li>
            </ul>
      )} else {
        return (
          <ul className="list-group list-group-flush">
            <li className="list-group-item">
              <div className="card-body px-0 p-1">
                <Row>
                <Col className="text-left"><span className="popup_link" onClick={() =>  props.selectSwitchAppend((node.key2))}>{node.node2.given_name_western} {node.node2.family_name_western}</span></Col>
                  <Col className="text-center">{node.rel.rel_type}</Col>
                  <Col className="text-end">{node.rel.start_year}-{node.rel.end_year}</Col>
                </Row>
              </div>
            </li>
          </ul>
    )}
    })
      return (
        <div>
          <h5 className="popup_section_head mt-2">Personal Relationships</h5>
          <div className="card">
            <div className="popup_card_header card-header">
              <Row>
                <Col className="text-left">Name</Col>
                <Col className="text-center">Relationship</Col>
                <Col className="text-end">Dates</Col>
              </Row>
            </div>
            {persList}
          </div>
        </div>)
    } else {}
  };

//CONSTRUCT INSTITUTIONAL RELATIONSHIP ARRAY & OUTPUT
  const getInstRels = () => {
    const instRels = props.selectArray.filter(type => type.rel_kind === "Institution")
    if (instRels.length > 0) {
    const instList = instRels.map(function(node) {
      if (node.rel.source) {
        return (
          <ul className="list-group list-group-flush">
            <li className="list-group-item pt-0 pb-0 border-bottom-0">
              <div className="card-body px-0 p-1">
              <Row>
                <Col className="text-left"><span className="popup_link" onClick={() =>  props.selectSwitchAppend(node.key2)}>{node.node2.name_western}</span></Col>
                <Col className="text-center">{node.rel.rel_type}</Col>
                <Col className="text-end">{node.rel.start_year}-{node.rel.end_year}</Col>
              </Row>
              </div>
            </li>
            <li className="card_sources list-group-item px-3 py-0 mb-2"><span className="popup_card_header sources">SOURCES:</span> {node.rel.source}</li>
          </ul>
    )} else {
      return (
        <ul className="list-group list-group-flush">
          <li className="list-group-item">
            <div className="card-body px-0 p-1">
              <Row>
                <Col className="text-left"><span className="popup_link" onClick={() =>  props.selectSwitchAppend((node.key2))}>{node.node2.name_western}</span></Col>
                <Col className="text-center">{node.rel.rel_type}</Col>
                <Col className="text-end">{node.rel.start_year}-{node.rel.end_year}</Col>
              </Row>
            </div>
          </li>
        </ul>
  )}
  })
    return (
      <div>
        <h5 className="popup_section_head mt-2">Institutional Relationships</h5>
        <div className="card">
          <div className="popup_card_header card-header">
            <Row>
              <Col className="text-left">Institution Name</Col>
              <Col className="text-center">Relationship</Col>
              <Col className="text-end">Dates</Col>
            </Row>
          </div>
          {instList}
        </div>
      </div>)
  } else {}
};

//CONSTRUCT CORPORATE ENTITY RELATIONSHIP ARRAY & OUTPUT
const getCorpRels = () => {
  const corpRels = props.selectArray.filter(type => type.rel_kind === "CorporateEntity")
  if (corpRels.length > 0) {
  const corpList = corpRels.map(function(node) {
    if (node.rel.source) {
      return (
        <ul className="list-group list-group-flush">
          <li className="list-group-item pt-0 pb-0 border-bottom-0">
            <div className="card-body px-0 p-1">
            <Row>
              <Col className="text-left"><span className="popup_link" onClick={() =>  props.selectSwitchAppend((node.key2))}>{node.node2.name_western}</span></Col>
              <Col className="text-center">{node.rel.rel_type}</Col>
              <Col className="text-end">{node.rel.start_year}-{node.rel.end_year}</Col>
            </Row>
            </div>
          </li>
          <li className="card_sources list-group-item px-3 py-0 mb-2"><span className="popup_card_header sources">SOURCES:</span> {node.rel.source}</li>
        </ul>
  )} else {
    return (
      <ul className="list-group list-group-flush">
        <li className="list-group-item">
          <div className="card-body px-0 p-1">
            <Row>
              <Col className="text-left"><span className="popup_link" onClick={() =>  props.selectSwitchAppend((node.key2))}>{node.node2.name_western}</span></Col>
              <Col className="text-center">{node.rel.rel_type}</Col>
              <Col className="text-end">{node.rel.start_year}-{node.rel.end_year}</Col>
            </Row>
          </div>
        </li>
      </ul>
)}
})
  return (
    <div>
      <h5 className="popup_section_head mt-2">Corporate Relationships</h5>
      <div className="card">
        <div className="popup_card_header card-header">
          <Row>
            <Col className="text-left">Organization Name</Col>
            <Col className="text-center">Relationship</Col>
            <Col className="text-end">Dates</Col>
          </Row>
        </div>
        {corpList}
      </div>
    </div>)
} else {}
};

//CONSTRUCT EVENT RELATIONSHIP ARRAY & OUTPUT
const getEventRels = () => {
  const eventRels = props.selectArray.filter(type => type.rel_kind === "Event")
  if (eventRels.length > 0) {
  const eventList = eventRels.map(function(node) {
    if (node.rel.source) {
      return (
        <ul className="list-group list-group-flush">
          <li className="list-group-item pt-0 pb-0 border-bottom-0">
            <div className="card-body px-0 p-1">
            <Row>
              <Col className="text-left"><span className="popup_link" onClick={() =>  props.selectSwitchAppend((node.key2))}>{node.node2.name_western}</span></Col>
              <Col className="text-center">{node.rel.rel_type}</Col>
              <Col className="text-end">{node.rel.start_year}-{node.rel.end_year}</Col>
            </Row>
            </div>
          </li>
          <li className="card_sources list-group-item px-3 py-0 mb-2"><span className="popup_card_header sources">SOURCES:</span> {node.rel.source}</li>
        </ul>
  )} else {
    return (
      <ul className="list-group list-group-flush">
        <li className="list-group-item">
          <div className="card-body px-0 p-1">
            <Row>
              <Col className="text-left"><span className="popup_link" onClick={() =>  props.selectSwitchAppend((node.key2))}>{node.node2.name_western}</span></Col>
              <Col className="text-center">{node.rel.rel_type}</Col>
              <Col className="text-end">{node.rel.start_year}-{node.rel.end_year}</Col>
            </Row>
          </div>
        </li>
      </ul>
)}
})
  return (
    <div>
      <h5 className="popup_section_head mt-2">Event Relationships</h5>
      <div className="card">
        <div className="popup_card_header card-header">
          <Row>
            <Col className="text-left">Event Name</Col>
            <Col className="text-center">Relationship</Col>
            <Col className="text-end">Dates</Col>
          </Row>
        </div>
        {eventList}
      </div>
    </div>)
} else {}
};

//CONSTRUCT BASIC INFORMATION
const getInfo = () => {
   if (props.selectArray.length > 0) {
     const info = props.selectArray[0]
     if (info.select_node.given_name_western) {
       return (
         <div>
           <Row>
             <Col><h4 className="popup_title" >{info.select_node.given_name_western} {info.select_node.family_name_western}</h4>
             <Button className="add_info_button btn btn-danger" data-prop="addinfo" onClick={(i) =>  props.toggleDisplay(i)} role="button" >See Additional Information</Button>
             </Col>
           </Row>
           <div className={props.addinfo}>
             <Row className="pt-2">
               <Col>
               <ul className="list-group list-group-flush">
                 <li className="list-group-item"><b>Alternate Western Names:</b> {info.select_node.alternative_name_western}</li>
                 <li className="list-group-item"><b>Chinese Name:</b> {info.select_node.chinese_family_name_hanzi} {info.select_node.chinese_given_name_hanzi}</li>
                 <li className="list-group-item"><b>Alternate Chinese Name:</b> {info.select_node.alternative_chinese_name_hanzi}</li>
                 <li className="list-group-item"><b>Chinese Romanization:</b> {info.select_node.chinese_family_name_romanized} {info.select_node.chinese_given_name_romanized}</li>
                 <li className="list-group-item"><b>Alternate Chinese Romanizations:</b> {info.select_node.alternative_chinese_name_romanized}</li>
                </ul>
                </Col>
                <Col>
                <ul className="list-group list-group-flush">
                 <li className="list-group-item"><b>Gender:</b> {info.select_node.gender}</li>
                 <li className="list-group-item"><b>Nationality:</b> {info.select_node.nationality}</li>
                 <li className="list-group-item"><b>Birth Year:</b> {info.select_node.birth_year}</li>
                 <li className="list-group-item"><b>Birth Place:</b> {info.select_node.birth_city}</li>
                 <li className="list-group-item"><b>Death Place:</b> {info.select_node.death_city}</li>
                 <li className="list-group-item"><b>Death Year:</b> {info.select_node.death_year}</li>
               </ul>
               </Col>
             </Row>
           </div>
         </div>
     )}
     else {
       return (

         <div>
           <Row>
             <Col><h4 className="popup_title" >{info.select_node.name_western}</h4>
             <Button className="add_info_button btn btn-danger" data-prop="addinfo" onClick={(i) =>  props.toggleDisplay(i)} role="button" >See Additional Information</Button>
             </Col>
           </Row>
           <div className={props.addinfo}>
             <Row className="pt-2">
               <Col>
               <ul className="list-group list-group-flush">
                 <li className="list-group-item"><b>Alternate Western Names:</b> {info.select_node.alternative_name_western}</li>
                 <li className="list-group-item"><b>Chinese Name:</b> {info.select_node.chinese_family_name_hanzi} {info.select_node.chinese_given_name_hanzi}</li>
                 <li className="list-group-item"><b>Alternate Chinese Name:</b> {info.select_node.alternative_chinese_name_hanzi}</li>
                 <li className="list-group-item"><b>Chinese Romanization:</b> {info.select_node.chinese_family_name_romanized} {info.select_node.chinese_given_name_romanized}</li>
                 <li className="list-group-item"><b>Alternate Chinese Romanizations:</b> {info.select_node.alternative_chinese_name_romanized}</li>
                </ul>
                </Col>
                <Col>
                <ul className="list-group list-group-flush">
                 <li className="list-group-item"><b>Christian Tradition:</b> {info.select_node.christian_tradition}</li>
                 <li className="list-group-item"><b>Religious Family:</b> {info.select_node.religious_family}</li>
                 <li className="list-group-item"><b>Category:</b> {info.select_node.category}</li>
                 <li className="list-group-item"><b>Subcategory:</b> {info.select_node.subcategory}</li>
               </ul>
               </Col>
             </Row>
           </div>
         </div>
     )}
  } else {}
};

//CONSTRUCT BREADCRUMBS
const breadLine = () => {
  const getCurrent = () => {
     if (props.selectArray.length > 0) {
       const info = props.selectArray[0]
       if (info.select_node.given_name_western) {return (`${info.select_node.family_name_western}, ${info.select_node.given_name_western} `)}
       else { return (info.select_node.name_western) }
     } else {}
   }
   const ellipse  = () => {
     const measure = props.breadCrumb
     if (measure.length > 4) {return (<span>... > </span>)}
     else {}
   }
  const breadList = props.breadCrumb
  if (breadList.length > 1 ) {
    const bread = breadList.map(function(crumb, i) {
      if (breadList.length - 1 === i) {}
      else if (crumb.family_name_western && (breadList.length - i) < 5){return (<span><span className="breadcrumb_link" onClick={() =>  props.selectSwitchReduce((crumb.key), (crumb.order))}>{crumb.family_name_western}, {crumb.given_name_western}</span> > </span>)}
      else if (crumb.name_western && (breadList.length - i) < 5){return (<span><span className="breadcrumb_link" onClick={() =>  props.selectSwitchReduce((crumb.key), (crumb.order))}>{crumb.name_western}</span> > </span>)}
      else {}
    })
    return (<div className="breadcrumb">{ellipse()} {bread} {getCurrent()}</div>)
  } else {}
};



  return (
    <div className={props.popupcontainer}>
      <BsX className="popup_close" data-prop="popupcontainer" onClick={(i) =>  props.toggleDisplay(i)}/>
        {breadLine()}
        {getInfo()}
        {getPersRels()}
        {getInstRels()}
        {getCorpRels()}
        {getEventRels()}

      </div>
  )
}

export default Popup
